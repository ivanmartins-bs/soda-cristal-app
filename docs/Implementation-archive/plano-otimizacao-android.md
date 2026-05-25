# Plano de Otimização de Performance — Android

**Data:** 10/04/2026
**Contexto:** O app funciona bem no iPhone, mas no Android apresenta lentidão no login e no carregamento das rotas.
**Tipo de app:** SPA web (Vite + React 18 + TypeScript), acessado via navegador mobile.
**Implementação:** Fase por fase, com verificação intermediária após cada fase.

---

## Premissas (respostas do time)

| Pergunta | Resposta |
|----------|---------|
| Controle do backend? | **Não.** Apenas frontend. |
| Perfil dos Androids? | Chrome, Android, **modelos mais antigos** (entrada/intermediário). |
| Rotas por dia? | **Menos de 10.** ~600 clientes/mês. Rotas mudam mensalmente ou quando o usuário sai do app e limpa cache. |
| Modo de implementação? | **Fase por fase** com testes intermediários. |

### Impacto das respostas na estratégia

- **Sem backend:** O item 2.1 será resolvido apenas no frontend (batch maior + menos delay). Não podemos criar endpoint consolidado.
- **Androids antigos:** O `build.target` precisa ser **mais conservador** (`chrome70`) para cobrir dispositivos de 4-5 anos atrás.
- **Rotas estáveis (~mensais com ~600 clientes):** O cache agressivo é extremamente valioso. Se os dados já estão no localStorage/memória, **não há necessidade de refetch** a cada login. A estratégia de persist e hidratação ganha ainda mais importância — os dados mudam pouco e o cache pode ser reaproveitado por dias.

---

## Diagnóstico

| # | Problema | Impacto | Arquivo(s) |
|---|----------|---------|------------|
| 1 | `build.target: 'esnext'` sem suporte a Android antigo | **ALTO** | `vite.config.ts` |
| 2 | Waterfall de API calls com delay de 150ms entre batches | **ALTO** | `rotasStore.ts` |
| 3 | localStorage síncrono com dados volumosos (persist) | **ALTO** | `rotasStore.ts`, `deliveryStore.ts` |
| 4 | **`clientesRota` não é persistido — standby recarrega tudo** | **CRÍTICO** | `rotasStore.ts` |
| 5 | Lazy loading sem prefetch pós-login | **MÉDIO-ALTO** | `App.tsx` |
| 6 | App.tsx com 3 store subscriptions causando re-renders | **MÉDIO** | `App.tsx` |
| 7 | Hidratação síncrona do persist no boot | **MÉDIO** | Zustand persist |

### Bug #4 — Detalhamento: standby recarrega todas as rotas

**Relato do usuário:** Quando o celular apaga a tela (standby), mesmo logado, o app recarrega todas as rotas ao voltar, causando lentidão e frustração.

**Causa raiz identificada:**

O `partialize` do `rotasStore` salva `rotas`, `rotasDeHoje` e timestamps, mas **NÃO salva `clientesRota`** (os ~600 clientes):

```ts
// rotasStore.ts — linha 246
partialize: (state) => ({
    rotas: state.rotas,
    rotasDeHoje: state.rotasDeHoje,
    lastFetchTodaysRoutes: state.lastFetchTodaysRoutes,
    lastFetchRotas: state.lastFetchRotas,
    lastFetchDate: state.lastFetchDate,
    // ❌ clientesRota NÃO está aqui
    // ❌ deliveriesPorRota NÃO está aqui
}),
```

A condição de cache depende de `clientesRota` estar na memória:

```ts
// rotasStore.ts — linha 101
const hasData = state.clientesRota.length > 0;
if (!forceRefresh && !isNewDay && validCache && hasData) {
    return; // ← só retorna se clientesRota TEM dados
}
```

**Fluxo do bug:**

1. Vendedor usa o app → `clientesRota` tem 600 clientes **na memória**
2. Celular entra em standby → Android mata a aba para liberar RAM
3. Vendedor volta → React remonta do zero
4. Zustand hidrata do localStorage: `rotas` e timestamps voltam ✅, `clientesRota` volta **vazio** ❌
5. `hasData = false` → cache ignorado → `shouldShowLoading = true`
6. Tela de loading "Buscando rotas..." → refetch de TODOS os clientes de TODAS as rotas
7. Com batch de 2 + delay de 150ms → **15-30 segundos de espera** para dados que já existiam

**Por que não persiste `clientesRota`?** Provavelmente porque os dados são pesados (~600 clientes com endereço, telefone, etc.) e já causaram `QuotaExceeded` no localStorage (existe `try/catch` no storage).

### Por que funciona bem no iPhone?

- Safari/WebKit no iOS tem engine JavaScript otimizada (JIT compilation agressivo), parsing de JS moderno (`esnext`) eficiente, e localStorage com I/O mais rápido.
- iPhones geralmente têm hardware mais uniforme e potente.
- **iOS é muito menos agressivo em matar abas em background** — o Safari mantém o estado da aba na memória por muito mais tempo que o Chrome no Android. Isso significa que o `clientesRota` sobrevive ao standby no iPhone, mas não no Android.
- Androids de campo (usados por vendedores) frequentemente têm processadores lentos, pouca RAM, Chrome/WebView desatualizados e rede móvel instável.

---

## Fase 1 — Correções de Impacto Imediato (Quick Wins)

### 1.1 Alterar `build.target` para suportar Android

**Arquivo:** `vite.config.ts`

**O que fazer:**
- Trocar `target: 'esnext'` por um target conservador para cobrir Androids de 4-5 anos:
  ```ts
  build: {
    target: ['es2020', 'chrome70', 'safari14'],
    outDir: 'dist',
  }
  ```
- `chrome70` cobre Android 8+ com WebView atualizado, que é o mínimo razoável para dispositivos de entrada ainda em uso.
- Isso garante que o Vite transpile features modernas que Android antigo não suporta.

**Resultado esperado:** Parsing e execução de JS significativamente mais rápidos em Androids de entrada.

**Esforço:** ~5 min

---

### 1.2 Prefetch dos chunks principais após o login

**Arquivo:** `App.tsx`

**O que fazer:**
- Após o `login()` ter sucesso (quando `isLoggedIn` muda para `true`), disparar `import()` dos chunks da página inicial (`DeliveriesOverview`) de forma antecipada.
- Alternativa: usar `<link rel="modulepreload">` para os chunks mais usados no `index.html`.
- Mover o preload do `BottomNavigation` para ocorrer logo no mount do componente autenticado, não apenas no hover/touch.

**Exemplo de prefetch no App.tsx:**
```tsx
useEffect(() => {
  if (isLoggedIn) {
    import("./presentation/pages/DeliveriesOverview");
    import("./presentation/pages/RoutesScreen");
  }
}, [isLoggedIn]);
```

**Resultado esperado:** Elimina 1-3s de espera entre login e renderização da primeira página.

**Esforço:** ~20 min

---

## Fase 2 — Otimização do Fluxo de Dados Pós-Login

### 2.1 Eliminar waterfall de API calls e delay artificial

**Arquivo:** `src/domain/rotas/rotasStore.ts` (função `loadTodaysRoutes`)

**Problema atual:**
```ts
const BATCH_SIZE = 2;
const DELAY_MS = 150;

for (let i = 0; i < todaysRoutes.length; i += BATCH_SIZE) {
    // busca 2 rotas por vez
    // espera 150ms entre cada batch
}
```

Se o vendedor tem 10 rotas no dia, o tempo mínimo de delay é: `(10/2 - 1) * 150ms = 600ms` + tempo real de cada request. No Android com rede 3G/4G instável, cada request pode demorar 1-3s.

**O que fazer (apenas frontend — sem controle do backend):**
- Aumentar o `BATCH_SIZE` de 2 para 5 (com < 10 rotas, isso significa no máximo 2 batches em vez de 5).
- Reduzir o `DELAY_MS` de 150ms para 50ms ou eliminar completamente (só manter se o backend realmente retorna 429).
- Iniciar o fetch das rotas **em paralelo** com o carregamento do chunk da página (combinando com o prefetch do item 1.2).
- **Estratégia de cache agressivo:** como as rotas mudam mensalmente (~600 clientes/mês), aproveitar o cache do Zustand persist. Se os dados já estão no localStorage e não expirou (mesmo dia), pular completamente o fetch e usar os dados cacheados. Atualmente o cache de 15 min é conservador demais para dados que mudam 1x/mês.
  - Aumentar `CACHE_MINUTES` de 15 para algo como 60-120 (ou até o dia inteiro).
  - Manter o `forceRefresh` para quando o vendedor quiser sincronizar manualmente.

**Resultado esperado:** Redução de 50-80% no tempo total de carregamento de dados pós-login. Na maioria das vezes, dados virão do cache sem nenhum fetch.

**Esforço:** ~30 min

---

### 2.2 Otimizar subscriptions do App.tsx

**Arquivo:** `src/App.tsx`

**Problema atual:**
```tsx
const { isLoggedIn, initialzedAuth, isInitialized, vendedorId } = useUserStore();
const { setSelectedCustomer, selectedCustomer } = useUiStore();
const {
  selectedDelivery, selectedRoute, deliveryStatuses,
  setSelectedDelivery, setSelectedRoute, updateDeliveryStatus
} = useDeliveryStore();
```

O componente raiz (`App`) faz subscribe em 3 stores Zustand com destructuring completo. Qualquer mudança em `deliveryStatuses`, `selectedCustomer`, etc., causa re-render de toda a árvore.

**O que fazer:**
- Usar seletores granulares do Zustand:
  ```tsx
  const isLoggedIn = useUserStore(s => s.isLoggedIn);
  const isInitialized = useUserStore(s => s.isInitialized);
  const vendedorId = useUserStore(s => s.vendedorId);
  ```
- Mover `deliveryStatuses`, `selectedDelivery`, `selectedRoute`, `selectedCustomer` para os componentes filhos que realmente precisam deles (`DeliveriesOverview`, `RouteDetails`, `CustomerList`, etc.).
- O `App.tsx` deveria subscrever apenas: `isLoggedIn`, `isInitialized`, `vendedorId` e funções de navegação.

**Resultado esperado:** Menos re-renders no componente raiz = transições mais fluidas no Android.

**Esforço:** ~30 min

---

## Fase 3 — Persistência e Sobrevivência ao Standby

> **Esta fase resolve diretamente o bug crítico #4:** o app recarrega tudo quando o celular sai do standby.

### 3.1 Persistir `clientesRota` via IndexedDB (correção do bug de standby)

**Arquivos:** `src/domain/rotas/rotasStore.ts`, `package.json`

**Problema atual:**
- `clientesRota` (~600 clientes) vive apenas na memória — não sobrevive ao Android matar a aba
- localStorage é limitado (~5MB) e síncrono — já causou `QuotaExceeded`
- Ao voltar do standby, `hasData = false` → refetch completo com loading spinner

**O que fazer:**
1. Instalar `idb-keyval` (IndexedDB simplificado, assíncrono, sem limite de 5MB):
   ```bash
   npm install idb-keyval
   ```

2. Trocar o storage do `persist` de localStorage para IndexedDB:
   ```ts
   import { get, set, del } from 'idb-keyval';

   storage: createJSONStorage(() => ({
     getItem: async (name) => (await get(name)) ?? null,
     setItem: async (name, value) => await set(name, value),
     removeItem: async (name) => await del(name),
   })),
   ```

3. Adicionar `clientesRota` e `deliveriesPorRota` ao `partialize`:
   ```ts
   partialize: (state) => ({
     rotas: state.rotas,
     rotasDeHoje: state.rotasDeHoje,
     clientesRota: state.clientesRota,           // ← NOVO
     deliveriesPorRota: state.deliveriesPorRota, // ← NOVO
     lastFetchTodaysRoutes: state.lastFetchTodaysRoutes,
     lastFetchRotas: state.lastFetchRotas,
     lastFetchDate: state.lastFetchDate,
   }),
   ```

4. Com IndexedDB, não há risco de `QuotaExceeded` (limite é centenas de MB) e a gravação é **assíncrona** (não bloqueia a main thread).

**Resultado esperado:** Ao voltar do standby, `clientesRota` é hidratado do IndexedDB → `hasData = true` → cache válido → **zero fetch, zero spinner, dados instantâneos**.

**Esforço:** ~45 min

---

### 3.2 Ajustar o `deliveryStore` — remover dados efêmeros do persist

**Arquivo:** `src/domain/deliveries/deliveryStore.ts`

**O que fazer:**
- `selectedDelivery` e `selectedRoute` são estados de navegação efêmeros — **não persistir**.
- Persistir apenas `deliveryStatuses` (necessário para saber quais entregas foram realizadas).
- Adicionar `partialize` para filtrar:
  ```ts
  partialize: (state) => ({
    deliveryStatuses: state.deliveryStatuses,
  }),
  ```

**Resultado esperado:** Menos dados serializados a cada mudança de estado.

**Esforço:** ~10 min

---

### 3.3 Otimizar hidratação do Zustand persist no boot

**Arquivos:** `src/domain/rotas/rotasStore.ts`, `src/App.tsx`

**Problema atual:**
Quando o app carrega, o Zustand com `persist` lê e parseia dados do storage **antes** da UI aparecer. Com IndexedDB isso já é assíncrono, mas podemos garantir que a hidratação não atrasa a renderização inicial.

**O que fazer:**
- Adicionar `skipHydration: true` no persist config do `rotasStore`.
- Hidratar manualmente **após** o `initialzedAuth` completar e a tela (login ou loading) já estar visível:
  ```ts
  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      useRotasStore.persist.rehydrate();
    }
  }, [isInitialized, isLoggedIn]);
  ```
- Isso garante que a tela de login ou loading aparece imediatamente, enquanto os dados pesados são carregados em background.

**Resultado esperado:** Tela inicial aparece mais rápido; a hidratação ocorre em background.

**Esforço:** ~20 min

---

## Fase 4 — PWA (Progressive Web App)

> Transforma o app web em uma experiência de app nativo no Android: ícone na tela inicial, tela cheia, cache offline de assets e dados.

### 4.1 Configurar `vite-plugin-pwa` + manifest

**Arquivos:** `vite.config.ts`, `package.json`

**O que fazer:**
1. Instalar dependência:
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. Configurar o plugin no `vite.config.ts`:
   ```ts
   import { VitePWA } from 'vite-plugin-pwa';

   plugins: [
     react(),
     VitePWA({
       registerType: 'autoUpdate',
       manifest: {
         name: 'Soda Cristal',
         short_name: 'Soda Cristal',
         description: 'Sistema de entregas Soda Cristal',
         theme_color: '#008000',
         background_color: '#f0fdf4',
         display: 'standalone',
         orientation: 'portrait',
         start_url: '/',
         icons: [
           { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
           { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
         ],
       },
     }),
   ],
   ```

3. O `manifest.json` é gerado automaticamente pelo plugin.

**Resultado esperado:** Chrome Android exibe prompt "Adicionar à tela inicial". App abre em tela cheia sem barra do navegador.

**Esforço:** ~30 min

---

### 4.2 Service Worker com cache de assets

**Arquivo:** `vite.config.ts` (configuração do `VitePWA`)

**O que fazer:**
- O `vite-plugin-pwa` gera automaticamente um Service Worker (via Workbox) que cacheia todos os assets do build (JS, CSS, imagens, fontes).
- Configurar estratégia `precache` para os assets estáticos:
  ```ts
  VitePWA({
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
      ],
    },
  }),
  ```

**Resultado esperado:** Após o primeiro acesso, todos os assets JS/CSS ficam no dispositivo. Reabrir o app (mesmo após standby ou sem internet) carrega instantaneamente — sem download de chunks.

**Esforço:** ~20 min

---

### 4.3 Cache de API (stale-while-revalidate)

**Arquivo:** `vite.config.ts` (seção `runtimeCaching` do Workbox)

**O que fazer:**
- Adicionar regras de cache para as respostas da API que mudam pouco (rotas, clientes):
  ```ts
  runtimeCaching: [
    {
      urlPattern: /\/api\/rotas\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-rotas',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      urlPattern: /\/api\/rotas-entregas\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-entregas',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      urlPattern: /\/api\/login/,
      handler: 'NetworkOnly',
    },
  ],
  ```
- **StaleWhileRevalidate**: serve os dados do cache imediatamente, e atualiza em background. Perfeito para dados que mudam 1x/mês.
- **NetworkOnly** para o login (sempre precisa ir ao servidor).

**Resultado esperado:** Mesmo sem internet ou com rede lenta, o vendedor vê as rotas e clientes que já foram carregados. A atualização acontece silenciosamente quando há conexão.

**Esforço:** ~25 min

---

### 4.4 Ícone, splash screen e botão de instalação

**Arquivos:** `public/icon-192.png`, `public/icon-512.png`, `src/App.tsx` ou componente dedicado

**O que fazer:**
1. Gerar ícones do app (192x192 e 512x512) a partir do logo existente (`logo_soda_cristal.png`).
2. Adicionar na pasta `public/`.
3. Criar um componente de prompt de instalação para guiar o vendedor:
   ```ts
   // Captura o evento beforeinstallprompt do Chrome
   window.addEventListener('beforeinstallprompt', (e) => {
     e.preventDefault();
     // Salva o evento para usar quando o vendedor clicar "Instalar"
     deferredPrompt = e;
   });
   ```
4. Exibir um banner discreto (ex: na tela de login ou após o primeiro uso) com botão "Instalar App".

**Resultado esperado:** Vendedor instala o app com um toque. Ícone "Soda Cristal" aparece na tela inicial do celular.

**Esforço:** ~15 min

---

### Benefícios combinados da PWA para o cenário do vendedor

| Situação | Sem PWA (hoje) | Com PWA |
|----------|---------------|---------|
| Abrir app após standby | Redownload de chunks + refetch de dados | Assets do cache local, dados do IndexedDB |
| Sem sinal no meio da rota | App quebra, tela branca | Dados cacheados continuam disponíveis |
| Primeiro acesso do dia | Download completo de JS/CSS | Apenas verifica atualizações, serve do cache |
| Experiência visual | Aba do Chrome com barra de endereço | Tela cheia, ícone na home, splash screen |
| Android mata o processo | Perde tudo, reload total | Assets no SW cache + dados no IndexedDB = restauração rápida |

---

## Resumo de Execução (fase por fase)

### Fase 1 — Quick Wins (~25 min)
| Item | Esforço | Impacto |
|------|---------|---------|
| 1.1 — Build target `chrome70` | ~5 min | **ALTO** |
| 1.2 — Prefetch de chunks | ~20 min | **MÉDIO-ALTO** |

**Verificação Fase 1:**
- [ ] `npm run build` sem erros
- [ ] Testar em Android antigo via Chrome — JS não quebra
- [ ] Login → primeira tela carrega visivelmente mais rápido

> Após validar Fase 1, iniciar Fase 2.

---

### Fase 2 — Fluxo de Dados (~60 min)
| Item | Esforço | Impacto |
|------|---------|---------|
| 2.1 — Waterfall de APIs + cache agressivo | ~30 min | **ALTO** |
| 2.2 — Subscriptions do App.tsx | ~30 min | **MÉDIO** |

**Verificação Fase 2:**
- [ ] Reabrir app com cache existente — dados aparecem instantaneamente (sem fetch)
- [ ] Sincronizar manualmente (botão) — fetch roda normalmente
- [ ] Network tab: menos requests, sem delays de 150ms
- [ ] Navegar entre telas — sem travamentos ou re-renders perceptíveis

> Após validar Fase 2, iniciar Fase 3.

---

### Fase 3 — Persistência e Sobrevivência ao Standby (~75 min)
| Item | Esforço | Impacto |
|------|---------|---------|
| 3.1 — Persistir `clientesRota` via IndexedDB (fix standby) | ~45 min | **CRÍTICO** |
| 3.2 — Ajustar deliveryStore (remover dados efêmeros) | ~10 min | **MÉDIO** |
| 3.3 — Hidratação lazy do persist | ~20 min | **MÉDIO** |

**Verificação Fase 3:**
- [ ] Abrir app → carregar rotas → colocar celular em standby por 5-10 min → voltar → **dados aparecem instantaneamente sem spinner**
- [ ] Fechar e reabrir o app — tela aparece rápido, sem tela branca prolongada
- [ ] Testar com rede lenta (3G simulado) — app continua responsivo com dados do cache
- [ ] Testar limpar cache do navegador e refazer login — dados são buscados corretamente
- [ ] Testar em Android de entrada (Samsung A03, Motorola G22 ou similar) — sem travamentos
- [ ] Verificar no DevTools > Application > IndexedDB que os dados estão sendo gravados

> Após validar Fase 3, iniciar Fase 4.

---

### Fase 4 — PWA (~90 min)
| Item | Esforço | Impacto |
|------|---------|---------|
| 4.1 — Configurar `vite-plugin-pwa` + manifest | ~30 min | **ALTO** |
| 4.2 — Service Worker com cache de assets | ~20 min | **ALTO** |
| 4.3 — Cache de API (stale-while-revalidate) | ~25 min | **ALTO** |
| 4.4 — Ícone, splash screen e botão de instalação | ~15 min | **MÉDIO** |

**Verificação Fase 4:**
- [ ] Abrir no Chrome Android → aparece banner/botão "Instalar app"
- [ ] Instalar → ícone aparece na tela inicial do celular
- [ ] Abrir via ícone → abre em tela cheia, sem barra do Chrome
- [ ] Desligar WiFi/dados → app abre e mostra dados cacheados (rotas já carregadas)
- [ ] Religar internet → dados sincronizam silenciosamente em background
- [ ] DevTools > Application > Cache Storage → assets JS/CSS estão cacheados
- [ ] DevTools > Application > Service Workers → SW ativo e funcionando

---

**Tempo total estimado:** ~4h10 (distribuído entre as 4 fases)

---

## Status de Implementação

| Fase | Status | Data |
|------|--------|------|
| Fase 1 — Quick Wins | ✅ Concluído | 10/04/2026 |
| Fase 2 — Fluxo de Dados | ⬜ Pendente | — |
| Fase 3 — Persistência / Standby | ✅ Concluído | 10/04/2026 |
| Fase 4 — PWA | ⬜ Pendente | — |
