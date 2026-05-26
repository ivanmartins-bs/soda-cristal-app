# Plano de Implementação: Melhorias no Fluxo de Check-in

Este documento descreve as alterações para resolver a duplicidade de registros no painel e implementar a expiração automática do status de visita.

## 1. Remoção de Check-in Duplicado

### Problema
O app registra duas linhas no painel: uma no "Check-in inicial" e outra na finalização ("Check-in full"). O app legado enviava apenas o resultado final.

### Alterações em `src/presentation/pages/CheckInScreen.tsx`
- **Remover** a chamada para `checkInService.registrarPresenca` dentro de `handleCheckIn`.
- Manter apenas a validação de GPS local (geofencing).
- Após a validação, avançar direto para a seleção de status (`setShowStatusSelection(true)`).

---

## 2. Expiração de Status (20 Horas)

### Problema
Atualmente, o status de "visitado" (check-in concluído) fica persistido no IndexedDB indefinidamente, fazendo com que o cliente apareça como concluído por 30 dias ou mais. Definimos 20 horas para garantir que o estado seja resetado antes do início da jornada do dia seguinte.

### Alterações em `src/domain/deliveries/deliveryStore.ts`
- Adicionar a função `cleanupOldStatuses` na interface e na implementação do store.
- A função deve percorrer `deliveryStatuses` e remover entradas com `timestamp` superior a 20 horas.

### Alterações em `src/App.tsx`
- Chamar `useDeliveryStore.getState().cleanupOldStatuses()` no `useEffect` de inicialização, após a hidratação dos stores.

---

## Verificação Esperada
1. **Unicidade:** Apenas 1 registro será gerado no painel de gestão (o registro final de check-in full).
2. **Performance:** Nenhuma chamada de rede ao clicar no botão inicial de check-in (apenas validação local de distância).
3. **Expiração:** Ao realizar um check-in hoje às 14:00, amanhã às 10:00 (20h depois) o cliente deve voltar a aparecer como "pendente" (cor original e botões de ação liberados).
