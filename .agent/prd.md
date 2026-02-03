---
title: PRD - Redesign do Aplicativo Soda Cristal
version: 1.0.0
date: 2025-11-25
status: Aguardando Aprovação de Telas
developer: Ivan Martins
stakeholder: Pedro Napoleão Jr.
---

# PRD - Redesign do Aplicativo Soda Cristal

> [!IMPORTANT]
> Este documento define o escopo completo do redesign do aplicativo móvel Soda Cristal, focado exclusivamente no desenvolvimento front-end.

---

## Metadados do Projeto

| Campo | Valor |
|-------|-------|
| **Data da Reunião** | 25 de novembro de 2025 |
| **Desenvolvedor Responsável** | Ivan Martins |
| **Aprovador das Telas** | Pedro Napoleão Jr. (cliente) |
| **Status Atual** | Aguardando aprovação final das telas no Figma |

---

## 1. Contexto e Objetivo

### Cliente
**Soda Cristal** - Empresa de distribuição de garrafas de água com gás retornáveis, atuante em Mato Grosso do Sul e Cuiabá.

### Objetivo Principal
Desenvolver um **redesign completo** do aplicativo móvel Android, gerando uma versão webview para execução no Android.

### Escopo Geral
> [!NOTE]
> Desenvolvimento **exclusivamente front-end**. O back-end e API Laravel existentes serão consumidos sem alterações.

---

## 2. Escopo Técnico

### Stack de Desenvolvimento

| Camada | Tecnologia | Observações |
|--------|-----------|-------------|
| **Front-end** | HTML/CSS/JavaScript | APK Android via webview |
| **Design** | Figma | Telas finalizadas e aguardando aprovação |
| **Ferramenta de Desenvolvimento** | Cursor/Antigravity | IDE com suporte a IA |
| **Back-end** | API Laravel (existente) | Documentada e pronta para consumo |

> [!WARNING]
> Sem alterações no back-end. API já em uso pelo time de IA.

---

## 3. Principais Funcionalidades

> [!TIP]
> Todas as funcionalidades são focadas no usuário **vendedor/entregador**, baseadas no aplicativo existente.

### 3.1. Gestão de Entregas e Rotas

#### Tela Inicial
- **Entregas pendentes** do dia
- **Entregas concluídas** do dia

#### Aba de Rotas
- Informações sincronizadas com o painel administrativo
- Cadastro e alocação de rotas gerenciados pelo cliente

---

### 3.2. Check-in de Entregas

#### Localização
- Check-in com **GPS** ao chegar no local de entrega

#### Registro de Status
- ✅ Sucesso
- ❌ Cliente ausente
- 🚫 Cliente não quis consumir
- 📝 Outros status personalizados

---

### 3.3. Registro de Vendas (PDV)

#### Tipos de Venda
- Vendas adicionais durante entregas (ex.: xaropes)
- PDV separado para vendas diretas

#### Formas de Pagamento
- 💳 Maquininha
- 📱 Pix
- 💵 Dinheiro

> [!NOTE]
> O aplicativo **não realiza transações financeiras**, apenas gestão interna dos registros.

---

### 3.4. Gestão de Clientes e Contratos

#### Cadastro de Clientes
- Cadastro completo de novos clientes pelo integrador
- Seleção de tipo de contrato:
  - Semanal
  - Quinzenal
  - Venda direta
  - Outros planos personalizados

#### Gestão de Contratos
- Geração automática de contrato
- Envio via WhatsApp para assinatura digital
- Aba dedicada para contratos aguardando assinatura

---

## 4. Funcionalidades Removidas

> [!CAUTION]
> A seguinte funcionalidade foi **removida** do escopo final:

- ❌ **Gestão de caixa** (solicitada inicialmente pela Myel)

---

## 5. Status e Próximos Passos

### Timeline

| Etapa | Status | Observações |
|-------|--------|-------------|
| **Design no Figma** | ⏳ Em aprovação | Aguardando Pedro Napoleão Jr. |
| **Desenvolvimento** | 🔜 Pendente | Início após aprovação das telas |
| **Prazo de Entrega** | ❓ Não definido | A definir após aprovação |

### Ações Necessárias

1. ✅ **Aprovação final das telas** pelo cliente (Pedro Napoleão Jr.)
2. 📋 **Handoff com Rafael** para orientar Ivan Martins sobre:
   - Acesso aos conteúdos
   - Documentação da API
   - Credenciais e ambientes

---

## 6. Recursos e Documentação

### Links Importantes
- 🎨 [Figma Design](#) *(adicionar link)*
- 📚 [Documentação API Laravel](#) *(adicionar link)*
- 🔧 [Painel Administrativo](#) *(adicionar link)*

### Contatos

| Função | Nome | Observações |
|--------|------|-------------|
| **Desenvolvedor** | Ivan Martins | Responsável pela implementação |
| **Aprovador** | Pedro Napoleão Jr. | Cliente final |
| **Handoff Técnico** | Rafael | Orientação sobre API e conteúdos |

---

## Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0.0 | 2025-11-25 | Versão inicial do PRD |