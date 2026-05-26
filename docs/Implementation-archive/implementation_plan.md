# Plano de Otimização de Performance — Soda Cristal App (Frontend)

Análise completa com dados reais do **Network tab** revelou o cenário completo de lentidão.

## User Review Required

> [!CAUTION]
> **Descoberta Crítica no Network:** O backend demora **21 segundos apenas para estabelecer a conexão** (stall/initial connection). O servidor em si responde em ~1.65s. Isso é um problema de **infraestrutura do backend** (cold start, connection pool, ou servidor sobrecarregado) que o frontend **não pode resolver**, mas pode **mitigar** com cache agressivo.

> [!WARNING]
> **Payload de 1.5 MB:** O endpoint `/rotas-entregas/rota/{id}` retorna **1,579 KB** de dados por chamada. Com múltiplas rotas, o usuário baixa vários MB de dados. Com persistência local, isso só precisa acontecer **uma vez por dia**.

---

## Dados Reais do Network (Captura do Cliente)

```
┌─────────────────────────────────┬──────────┬───────────┬────────────────┬──────────────┐
│ Request                         │ Payload  │ Total     │ Server Wait    │ Stall/Queue  │
├─────────────────────────────────┼──────────┼───────────┼────────────────┼──────────────┤
│ /rotas/89  (lista rotas)        │ 2.7 KB   │ 22.05s    │ 186ms ✅       │ 21.78s 🔴    │
│ /rotas-entregas/rota/9 (clientes│ 1,579 KB │ 23.72s    │ 1.65s          │ 21.03s 🔴    │
└─────────────────────────────────┴──────────┴───────────┴────────────────┴──────────────┘
```

**Breakdown do request `/rotas-entregas/rota/9`:**
- Queueing: 175ms
- **Stalled: 21.03s** ← Esperando conexão com o server
- **Initial connection: 21.03s** ← Server demora 21s para aceitar a conexão
- SSL: 164ms
- Waiting (server response): 1.65s ← A query em si é ok
- Content Download: 1.05s ← Download de 1.5 MB

**Conclusão:** 90% do tempo de loading (21s de 23s) é **stall de conexão no backend**. O frontend NÃO tem como resolver isso, mas pode **evitar que o usuário sofra com isso** usando cache persistente.

---

## Diagnóstico Completo — Problemas Identificados

| # | Problema | Impacto | Causa Raiz |
|---|---|---|---|
| 🔴 1 | **Stall de 21s na conexão com o backend** | **BLOQUEANTE** | Backend (infraestrutura/cold start) |
| 🔴 2 | **Zero cache persistente** — dados perdidos a cada reload | **CRÍTICO** | `rotasStore` sem `persist` |
| 🔴 3 | **Requests sequenciais** — request 2 espera 21s na fila | **CRÍTICO** | `BATCH_SIZE = 1` + delay 300ms |
| 🟡 4 | **`console.log` dentro de `.map()` com 551 itens** | **ALTO** | `RouteDetails.tsx`, `PDVStandalone.tsx` |
| 🟡 5 | **Listas de 551+ cards** sem virtualização | **ALTO** | `RouteDetails.tsx` |
| 🟡 6 | **Mapper duplicado** em 2 arquivos | **MÉDIO** | DRY violation |
| 🟢 7 | **Imports eager** de todas as páginas | **MÉDIO** | `App.tsx` sem lazy loading |
| 🟡 8 | **CustomerList/RoutesScreen** recarregam tudo | **ALTO** | Hook `useRotas` sem persist |

---

## Proposed Changes

### Fase 1 — Cache Persistente com Stale-While-Revalidate (MAIOR IMPACTO) ⭐

> **Meta**: O app deve abrir **instantaneamente** com dados do cache. O usuário nunca mais espera 23 segundos.
> 
> **Estratégia: Stale-While-Revalidate**
> 1. Abriu o app → mostra dados do `localStorage` imediatamente (mesmo que "velhos")
> 2. Em background, faz refresh silencioso se os dados expiraram
> 3. Quando o refresh terminar, atualiza a UI sem loading spinner

---

#### [MODIFY] [rotasStore.ts](file:///c:/bystartup/soda-app/src/domain/rotas/rotasStore.ts)

Mudanças:
- Adicionar `zustand/persist` com chave `soda-rotas-storage`
- **Persistir:** `rotas`, `rotasDeHoje`, `clientesRota`, `deliveriesPorRota`, `lastFetchTodaysRoutes`, `lastFetchRotas`
- **NÃO persistir:** `isLoading`, `error`, `loadingStep`, `loadingProgress`
- Implementar **stale-while-revalidate**:
  - Se cache < 15min → NÃO refaz request (cache hit)
  - Se cache entre 15min-8h → Mostra cache + refaz request em background
  - Se cache > 8h (ou novo dia) → Force refresh com spinner
- Adicionar campo `lastFetchDate` (string YYYY-MM-DD) para invalidar cache quando muda o dia
- Aumentar `BATCH_SIZE` de 1 para 2 (ou 3 se backend aguentar)
- Reduzir `DELAY_MS` de 300ms para 150ms

---

### Fase 2 — Eliminação de Console.logs e Re-renders

> **Meta**: Zero output desnecessário que causa lag visível.

---

#### [MODIFY] [RouteDetails.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/RouteDetails.tsx)

- **Remover** `console.log(clientesRota)` (linha 62) — loga 551 objetos completos a cada render, cada um com ~3KB
- Memoizar o card de delivery com `React.memo` para evitar re-render de todos os 551 cards quando 1 status muda

#### [MODIFY] [RoutesScreen.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/RoutesScreen.tsx)

- **Remover** `console.log(rotas)` (linha 45)

#### [MODIFY] [PDVStandalone.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/PDVStandalone.tsx)

- **Remover** `console.log("ID DISTRIBUIDOR:...")` (linha 75)
- **Remover** `console.log(produtosData)` (linha 76)
- **Remover** `console.log(product)` (linha 359) — dentro de `.map()`, executa a cada render de cada produto

---

### Fase 3 — Virtualização Profissional e Polimento ⭐

#### [MODIFY] [RouteDetails.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/RouteDetails.tsx)
- **Tipagem**: Substituir `any` no `MemoizedDeliveryCard` por uma interface rigorosa.
- **Memoização**: Garantir que o mapeamento de `clientesRota` para entregas use `useMemo`.
- **Performance**: Reduzir re-renders ao navegar entre filtros.

#### [MODIFY] [DeliveriesOverview.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/DeliveriesOverview.tsx)
- **Memoização**: Envolver `allDeliveries`, `todayDeliveries`, e `mappedRoutes` em `useMemo`. Atualmente eles são recalculados em cada render, o que pesa com 500+ clientes em memória.

---

### Fase 4 — Lazy Loading e Preloading (Prioridade: Deliveries) ⭐

> **Meta**: Reduzir o bundle inicial em ~60% e melhorar o FCP (First Contentful Paint).

#### [NEW] [PageLoader.tsx](file:///c:/bystartup/soda-app/src/presentation/components/ui/PageLoader.tsx)
- Componente de Skeleton para ser usado como fallback do `Suspense`.

#### [MODIFY] [App.tsx](file:///c:/bystartup/soda-app/src/App.tsx)
- converter todas as rotas para `React.lazy()`.
- Envolver o componente `<Routes />` com `<Suspense fallback={<PageLoader />} />`.

#### [MODIFY] [BottomNavigation.tsx](file:///c:/bystartup/soda-app/src/presentation/components/BottomNavigation.tsx)
- Implementar a lógica de **Preloading**.
- Adicionar handlers para disparar o import das páginas nos eventos `onMouseEnter` e `onTouchStart`.

---

### Fase 5 — Extração de Mapper Duplicado (DRY)

> **Meta**: Eliminar duplicação e processamento duplicado.

---

#### [NEW] [delivery-mapper.ts](file:///c:/bystartup/soda-app/src/domain/deliveries/delivery-mapper.ts)

- Mover `mapClienteToDelivery` e `mapPrioridade` para arquivo único compartilhado

#### [MODIFY] [DeliveriesOverview.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/DeliveriesOverview.tsx)

- Substituir mapper local pelo import do `delivery-mapper.ts`

#### [MODIFY] [RouteDetails.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/RouteDetails.tsx)

- Substituir mapper local pelo import do `delivery-mapper.ts`

---

### Fase 6 — Recomendação para Backend (Fora do Escopo, mas Documentada)

> [!CAUTION]
> **Estas melhorias são do BACKEND e precisam ser repassadas à equipe de backend.** O frontend não pode resolver o stall de 21s na conexão.

**Problemas identificados no backend:**
1. **Initial connection de 21 segundos** — Indica cold start do servidor, connection pool esgotado, ou servidor compartilhado/subdimensionado
2. **Payload de 1.5 MB por rota** — O backend deveria retornar apenas os campos necessários para o frontend (projeção/select parcial), não o objeto completo
3. **Sem paginação server-side** — 551 clientes em uma única resposta é impraticável para mobile
4. **Sem compressão gzip/brotli** — 1.5 MB poderia ser reduzido para ~200-300 KB com compressão

**Recomendações para o backend:**
- Habilitar **gzip compression** no servidor (redução de ~80% no payload)
- Criar endpoint otimizado `/rotas-entregas/rota/{id}/resumo` com campos mínimos
- Implementar paginação: `?page=1&limit=50`
- Investigar e resolver o stall de 21s na conexão (possível keep-alive, connection pool, ou scaling do servidor)

---

## Open Questions

> [!IMPORTANT]
> **1. Backend team:** Você tem acesso ao backend para investigar o stall de 21s na conexão? Ou é um serviço terceiro/legado? Isso é o **maior vilão** da lentidão.

> [!IMPORTANT]
> **2. Expiração do cache:** Sugiro que os dados expirem quando mudar o dia (meia-noite), já que as rotas são definidas por dia. Assim o vendedor sempre vê os dados de hoje. Concorda?

> [!IMPORTANT]
> **3. Paralelização:** O `BATCH_SIZE = 1` parece ter sido colocado por medo de rate limit (429). Pelos dados do network, o servidor aceita as conexões — só demora muito. Posso aumentar para 2 ou 3 simultâneos?

---

## Estimativa de Impacto

| Cenário | Antes | Depois (estimado) |
|---|---|---|
| **Primeiro acesso do dia** | ~45s (rotas + clientes sequenciais) | ~25s (paralelo) + cache salvo |
| **Segundo acesso em diante** | ~45s (recarrega tudo) | **< 1s** (cache do localStorage) ⚡ |
| **Troca de aba** | Recarrega dados | **Instantâneo** (dados em memória) |
| **Scroll em 551 clientes** | Lag visível (console.log + DOM pesado) | **Suave** (sem log + paginação) |

---

## Verification Plan

### Automated Tests
- `npm run build` — garantir que compila sem erros
- DevTools Console — verificar zero `console.log` restante
- DevTools Network — comparar waterfall antes/depois
- DevTools Application → Local Storage — verificar que `soda-rotas-storage` existe e contém dados

### Manual Verification
1. Abrir a tela de deliveries → dados do cache aparecem instantaneamente
2. F5 → sem spinner de loading (dados do cache)
3. Na aba "Timing" do Network → verificar que não há requests na segunda visita
4. Scroll em lista de 551 clientes → verificar fluidez
5. Navegar entre abas → verificar que não recarrega
