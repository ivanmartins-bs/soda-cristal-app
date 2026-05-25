# Plano de Implementação: Correção da Sincronização de Check-ins

Este plano visa alinhar o payload de check-in do novo aplicativo com as expectativas do backend legado, baseando-se na análise do código-fonte do aplicativo Android antigo (`appsodacristal-master`).

## Problemas Identificados
1. **Formato de Data Inválido:** O backend espera `yyyy-MM-ddTHH:mm:ss`, mas o app novo envia `dd/MM/yyyy HH:mm:ss`.
2. **Incompatibilidade de Tipos:** Coordenadas e ID do vendedor são esperados como `String`, mas estão sendo enviados como `Number`.
3. **Campos Extras:** O payload atual contém `cliente_id` e `teve_venda`, que não existiam no app original e podem estar causando rejeição ou erro de processamento no servidor.

## Mudanças Propostas

---

### [Componente] Shared Utils

#### [MODIFY] `src/shared/utils/formatters.ts`
- Adicionar a função `formatCheckInLegacy(date: Date): string` para gerar o formato `yyyy-MM-ddTHH:mm:ss`.

---

### [Componente] Domain Checkin

#### [MODIFY] `src/domain/checkin/models.ts`
- Atualizar a interface `CheckInRequest` para refletir os tipos de dados esperados pela API legada.

#### [MODIFY] `src/domain/checkin/services.ts`
- Ajustar `realizarCheckIn` e `registrarPresenca` para:
  - Usar o novo formatador de data.
  - Converter `vendedor`, `latitude` e `longitude` para `String`.
  - Remover `cliente_id` e `teve_venda` do payload final enviado para a API.

---

### [Componente] Presentation

#### [MODIFY] `src/presentation/pages/CheckInScreen.tsx`
- Garantir que os dados passados para os serviços de check-in estejam de acordo com as novas interfaces.

---

## Plano de Verificação

### Teste Manual
1. Realizar um check-in de teste em ambiente de desenvolvimento.
2. Monitorar a aba Network do navegador para validar o JSON enviado.
3. Verificar se o check-in aparece no Painel de Gestão.
