# TDD - Botões de Alteração e Desativação após Check-in

Este documento especifica a implementação dos botões de **Editar Cliente** e **Desativar Cliente** diretamente no card do cliente após a realização do check-in na listagem de rotas.

---

## 📌 Contexto e Problema
Atualmente, quando um cliente ainda **não** passou por check-in, o botão "Ações do Cliente" exibe uma folha (Sheet) contendo as opções de "Editar Cliente" e "Desativar Cliente". 
No entanto, assim que o check-in é realizado (`checkInStatus` fica ativo), a interface substitui essa seção por uma barra de status com a opção de "Descartar" o check-in, impossibilitando que o usuário altere ou desative o cliente a partir dali.

De acordo com o layout atual e a imagem em anexo:
- Quando o check-in é concluído (ex: "Entregue"), a barra de status verde (ou cinza/vermelha dependendo do tipo de check-in) mostra a etiqueta e o botão "Descartar".
- Precisamos adicionar opções rápidas ou integradas para **Editar** e **Desativar** o cliente mesmo após ele ter o check-in realizado.

---

## 🛠️ Proposta de Interface (UI/UX)
Para manter o design premium, limpo e sem poluir o card, propomos adicionar os dois botões no mesmo contêiner da barra de status do check-in ou logo abaixo dela.

### Opção Recomendada (Inline no container de status ou abaixo dele)
Logo abaixo da barra de status de check-in (dentro do bloco `checkInStatus` no card), adicionaremos uma linha com botões compactos e sem bordas pesadas usando Tailwind:

```tsx
{checkInStatus && (
  <div className="pt-2 border-t space-y-2">
    {/* Barra de Status Atual */}
    <div className={`flex items-center justify-center p-3 rounded-lg ${checkInStatus.color}`}>
      ...
      <Button variant="ghost" ...>Descartar</Button>
    </div>
    
    {/* Novos botões de Ações pós-Check-in */}
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
        onClick={() => handleEditarCliente()}
      >
        <Edit className="w-3.5 h-3.5 mr-1" />
        Editar Cliente
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex-1 text-xs text-red-700 border-red-200 hover:bg-red-50"
        onClick={() => handleDesativarCliente()}
      >
        <UserX className="w-3.5 h-3.5 mr-1" />
        Desativar
      </Button>
    </div>
  </div>
)}
```

---

## 💻 Alterações Propostas

### Camada de Apresentação

#### [MODIFY] [RouteDetails.tsx](file:///c:/bystartup/soda-app/src/presentation/pages/RouteDetails.tsx)
Modificar o componente `MemoizedDeliveryCard` para expor os cliques dos novos botões de Editar e Desativar quando o check-in estiver ativo.

1. **Localizar o bloco condicional de renderização do `checkInStatus` (linhas 397-432).**
2. **Adicionar a seção com os botões reutilizando os estados `setClienteParaEditar`, `setEditSheetOpen`, `setClienteParaDesativar`, e `setDesativarSheetOpen` que já existem no componente pai.**

Exemplo de alteração estrutural no JSX:
```diff
           {checkInStatus && (
-            <div className="pt-2 border-t">
+            <div className="pt-2 border-t space-y-2">
               <div
                 className={`flex items-center justify-center p-3 rounded-lg ${checkInStatus.color}`}
               >
                 {(() => {
                   const StatusIcon = checkInStatus.icon;
                   return (
                     <StatusIcon
                       className={`w-4 h-4 ${checkInStatus.textColor} mr-2`}
                     />
                   );
                 })()}
                 <span
                   className={`text-sm font-medium ${checkInStatus.textColor}`}
                 >
                   {checkInStatus.label}
                 </span>
                 {statusData?.hadSale && (
                   <span className="ml-2 text-xs">💰</span>
                 )}
                 <Button
                   variant="ghost"
                   size="sm"
                   className="ml-auto h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                   onClick={(e) => {
                     e.stopPropagation();
                     setDeliveryParaDescartar(delivery);
                     setDescarteSheetOpen(true);
                   }}
                 >
                   Descartar
                 </Button>
               </div>
+              
+              {/* Ações pós-checkin */}
+              <div className="flex gap-2">
+                <Button
+                  variant="outline"
+                  size="sm"
+                  className="flex-1 text-xs text-amber-700 border-amber-200 hover:bg-amber-50 h-8"
+                  onClick={(e) => {
+                    e.stopPropagation();
+                    const original = clientesRota.find(
+                      (c: any) => c.cliente.id === delivery.clienteId,
+                    );
+                    if (original) {
+                      setClienteParaEditar(original);
+                      setEditSheetOpen(true);
+                    }
+                  }}
+                >
+                  <Edit className="w-3.5 h-3.5 mr-1" />
+                  Editar Cliente
+                </Button>
+                <Button
+                  variant="outline"
+                  size="sm"
+                  className="flex-1 text-xs text-red-700 border-red-200 hover:bg-red-50 h-8"
+                  onClick={(e) => {
+                    e.stopPropagation();
+                    const original = clientesRota.find(
+                      (c: any) => c.cliente.id === delivery.clienteId,
+                    );
+                    if (original) {
+                      setClienteParaDesativar(original);
+                      setDesativarSheetOpen(true);
+                    }
+                  }}
+                >
+                  <UserX className="w-3.5 h-3.5 mr-1" />
+                  Desativar Cliente
+                </Button>
+              </div>
             </div>
           )}
```

---

## 🧪 Plano de Validação

### Testes Manuais
1. Abrir a listagem de rotas e selecionar uma rota ativa.
2. Realizar o check-in em um cliente (ex: marcar como "Entregue" ou "Não quis consumir").
3. Verificar se a barra de status do check-in aparece com os botões **Editar Cliente** e **Desativar Cliente** logo abaixo dela.
4. Clicar em **Editar Cliente**: verificar se o formulário/sheet de edição de dados do cliente é aberto corretamente com os dados preenchidos.
5. Clicar em **Desativar Cliente**: verificar se a sheet de confirmação de desativação é aberta corretamente.
6. Cancelar ou concluir as ações e certificar-se de que o estado do check-in permanece inalterado.
