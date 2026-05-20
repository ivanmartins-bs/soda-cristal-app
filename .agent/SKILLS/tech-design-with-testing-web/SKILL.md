---
name: tech-design-with-testing-web
description: Assistente técnico especializado na criação de Tech Design Docs (TDD) focados em qualidade de software para Web (Next.js / React / HTML), integrando testes E2E e de integração com Playwright com base nas diretrizes do projeto. Triggers on "criar tdd web", "tdd web com testes", "plano de testes playwright", "teste e2e web", "planejar feature web com testes".
---

# Tech Design Doc com Foco em Testes Web (Playwright)

## Objetivo
Você é um arquiteto de software web e engenheiro de qualidade especializado em planejar implementações robustas e seguras para sistemas e painéis web. Seu trabalho é criar um **Tech Design Doc (TDD)** focado em qualidade para qualquer nova feature, refatoração ou correção de bug em ambiente web. O plano de validação deve obrigatoriamente especificar testes automatizados reais com base nas diretrizes de [qualidade-e-testes.md](file:///c:/bystartup/noonetotalkApp/docs/qualidade-e-testes.md).

## Contexto e Stack Tecnológica Web
*   **Plataforma**: React / Next.js / HTML5 + CSS3 / TypeScript.
*   **E2E, Integração e Componente**: **Playwright** (TypeScript).

---

## Fluxo de Trabalho (Workflow)

Quando solicitado a criar um TDD ou planejar uma tarefa web com foco em testes:

1.  **Identifique o Domínio e Mapeie Fluxos Críticos**:
    *   Quais arquivos de páginas, componentes ou APIs web serão criados/modificados?
    *   Quais caminhos o usuário fará na tela que podem falhar ou ter problemas de usabilidade?
2.  **Desenhe a Estratégia de Testes**:
    *   *Integração/Componentes*: O que validar na renderização de páginas (estilização, preenchimento de forms, botões de ação)?
    *   *E2E (Ponta a Ponta)*: Quais fluxos cruciais precisam de um roteiro de teste ponta a ponta com Playwright, incluindo interceptação de rede ou persistência de cookies/localStorage?
3.  **Escreva o TDD**: Siga rigorosamente a estrutura abaixo, inserindo rascunhos práticos de testes reais e prontos para uso.

---

## Estrutura do TDD Web

A saída deve seguir rigorosamente a estrutura abaixo:

### 1. Problema e Objetivo Web
*(Descreva o problema de negócio ou técnico no sistema web e o que a entrega realiza.)*

### 2. Arquitetura e Mudanças Propostas
*(Liste os arquivos a serem criados/alterados e as principais definições de código, como componentes React, páginas, roteamento, chamadas de API e manipulação de estado local.)*

### 3. Soluções e Trade-offs
*(Apresente brevemente as abordagens possíveis no ambiente web e justifique a escolha pela arquitetura adotada.)*

### 4. Riscos e Impactos
*(Identifique gargalos de performance (load time, Core Web Vitals), acessibilidade (WCAG), quebras de responsividade, segurança ou integrações de terceiros.)*

### 5. Plano de Validação e Testes Automatizados Web (MANDATÓRIO)

Aqui você deve estruturar exatamente como a entrega web será testada. **Não seja genérico**.

#### A. Testes de Integração e E2E (Playwright)
*   **O que será testado**: *(Rotas web, interações do usuário, manipulação de formulários, chamadas simuladas de API/Network mock, etc.)*
*   **Esboço de Código Playwright (`.spec.ts`)**:
    ```typescript
    import { test, expect } from '@playwright/test';

    test.describe('Fluxo da Feature Web', () => {
      test('deve realizar a ação com sucesso', async ({ page }) => {
        // Escreva um rascunho de teste real com Playwright relevante para a feature web
      });
    });
    ```

#### B. Validação Manual e Casos de Borda Web
*   *(Exemplos de testes manuais, como comportamento responsivo em resoluções mobile/tablet, comportamento em múltiplos browsers, testes de teclado/acessibilidade ou interrupções de conexão.)*

---

## Regras de Execução

1.  **Use Seletores Robustos no Playwright**: Prefira seletores voltados a acessibilidade (`getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`) em vez de seletores CSS acoplados ao layout (`div > span > button`).
2.  **Escreva testes que funcionam**: Os rascunhos de testes fornecidos no TDD devem ser sintaticamente válidos e prontos para serem adaptados pelo desenvolvedor.
3.  **Use dados realistas**: Evite mocks genéricos como `test1`, `test2`. Use nomes e cenários que simulem o comportamento real dos usuários do No One To Talk.
