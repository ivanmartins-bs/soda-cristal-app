---
trigger: always_on
---

# Project Rules – React + Vite + TS + Tailwind (Presentation / Domain / Shared)

## Stack
- React com Vite, TypeScript e Tailwind CSS.
- Usar componentes funcionais e hooks.
- Estilização principal com Tailwind CSS.

## Arquitetura

- `src/presentation/`: camada de apresentação (React + Tailwind)
  - `pages/`: páginas/rotas, responsáveis por orquestrar UI.
  - `components/`: componentes reutilizáveis de UI específicos da app.
  - `layout/`: layouts de página (shells, headers, sidebars).
  - `hooks/`: hooks de UI (estado de tela, comportamento visual).

- `src/domain/`: regras de negócio organizadas por domínio (auth, users, etc.)
  - Cada domínio deve ter sua própria pasta: `src/domain/<domínio>/`.
  - Dentro de cada domínio:
    - `models.ts`: tipos/entidades do domínio.
    - `services.ts`: funções de caso de uso (ex.: `getUsers`, `loginUser`).
    - `mappers.ts`: (opcional) mapeamentos API ↔ modelos de domínio.

- `src/shared/`: utilitários e recursos compartilhados entre domínios/telas.
  - `api/`: client HTTP e utilitários relacionados a API.
    - `httpClient.ts`: instância configurada (axios/fetch) com baseURL, interceptors, etc.
  - `ui/`: componentes de UI totalmente genéricos.
  - `hooks/`: hooks reutilizáveis genéricos (ex.: `useDebounce`, `useMediaQuery`).
  - `utils/`: funções puras, helpers e formatters.
  - `config/`: configurações globais (ex.: envs, feature flags).
  - `types/`: tipos globais compartilhados.

## Regras de acesso a dados / API

- Toda a configuração de HTTP deve ficar em `src/shared/api/httpClient.ts`.
- Chamadas a endpoints específicos devem ser implementadas em `services.ts` dentro do domínio correspondente em `src/domain/<domínio>/`.
- Componentes na camada `presentation` **não devem** chamar `httpClient` diretamente:
  - Devem usar funções expostas pelos serviços de domínio.
- Qualquer transformação de dados da API para modelos de domínio deve ser centralizada no domínio (`services.ts` ou `mappers.ts`), não na UI.

## Estilo e princípios

- Usar TypeScript em todos os arquivos novos.
- Seguir Clean Code, DRY e KISS.
- Manter componentes pequenos e focados em uma responsabilidade.
- Evitar lógica de negócio dentro de componentes de página; preferir extraí-la para hooks e serviços no domínio.
- Reutilizar componentes e hooks em vez de duplicar lógica.

### TypeScript

- **SEMPRE** use TypeScript estrito
- **NUNCA** use `any`, prefira `unknown`
- **SEMPRE** use interfaces para objetos
- Use tipos (`type`) apenas para unions/intersections
- Evite enums, use const objects ou union types

## Workflow com o agente

O workflow é dividido em **dois estágios obrigatórios** com skills especializados:

### Estágio 1 — Planejamento com `project-architect`

Use o skill `.agent/SKILLS/project-architect` para:
- Entender o requisito e identificar domínios impactados.
- Propor a estrutura completa: pastas, nomes de arquivos, interfaces e integração.
- Verificar domínios, endpoints e componentes UI já existentes.
- Gerar a proposta em markdown para aprovação do usuário.

> **Nunca inicie a implementação sem a aprovação da proposta do arquiteto.**

### Estágio 2 — Implementação com `feature-implementor`

Após aprovação da proposta, use o skill `.agent/SKILLS/feature-implementor` para:
- Implementar o código **de baixo para cima** (endpoints → domain → store → presentation).
- Respeitar rigorosamente as regras de camada e convenções do projeto.
- Reportar ao usuário os arquivos criados/modificados e pontos de atenção.

### Regras gerais
- Antes de gerar código, sempre indicar:
  - Qual domínio está sendo impactado (`domain/users`, `domain/auth`, etc.).
  - Quais arquivos em `presentation` serão criados/alterados.
- Propor a localização de novos arquivos seguindo a arquitetura acima antes de implementar.
- Não criar novas pastas de arquitetura sem explicitar o racional e como elas se encaixam nesse modelo.

## Documentação

- **Visão geral**: README.md e docs\soda-cristal-context.md

- Quando precisar de documentação externa use o MCP Context7