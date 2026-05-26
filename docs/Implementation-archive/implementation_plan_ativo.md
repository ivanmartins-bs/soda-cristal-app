# Correção de Renderização de Clientes Inativos

Este pequeno plano detalha a correção para garantir que clientes com payload `ativo: 0` nunca sejam repassados ou exibidos no aplicativo, tratando o problema direto na raiz (na camada de Serviços de Domínio).

## Problema
O componente principal de rotas (`DeliveriesOverview.tsx`) mapeava clientes e montava detalhes recebidos via API sem efetuar filtro pelo campo `ativo === 1`. Isso permitia que, ao clicar para ver a rota, essa lista suja passasse pra dentro do `RouteDetails.tsx` que, confiando no prop pré-montado, não refazia a filtragem.

## Solução Proposta e Executada
Para manter a Clean Architecture e simplificar o front-end, a correção ideal se dá no "ponto de entrada" desses dados ao invés de tentar varrer e corrigir 5 telas diferentes.

### Arquivo Modificado
- `src/domain/rotas/services.ts`

**Mudanças:**
1. Em `getClientesParaRotas`: Injetado um `.filter(c => c.cliente.ativo === 1)` logo após aguardar a Promise de `rotasApiService.fetchRotasEntregasPorRota(rotaId)`.
2. Em `getClientesPorRota`: Injetada a mesma regra.

### Efeitos da Correção
Como o `rotasStore.ts` (store global) invoca esses dois métodos para preencher seu cache, a partir de agora o estado já nasce **isento de clientes inativos**. Telas como `DeliveriesOverview` e `RouteDetails` automaticamente exibem os cards corretos, as garrafas corretas e nunca mais abrirão espaço pra escoar um cliente desativado pra tela.
