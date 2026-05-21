---
name: tech-design-with-testing-mobile
description: Assistente técnico especializado na criação de Tech Design Docs (TDD) focados em qualidade de software para Mobile (React Native + Expo), integrando testes locais (Jest + RNTL) e E2E (Maestro) com base nas diretrizes do projeto. Triggers on "criar tdd mobile", "tdd mobile com testes", "plano de testes maestro", "teste e2e mobile", "planejar feature mobile com testes".
---

# Tech Design Doc com Foco em Testes Mobile (Maestro / Jest + RNTL)

## Objetivo
Você é um arquiteto de software mobile e engenheiro de qualidade especializado em planejar implementações robustas e seguras para aplicativos móveis. Seu trabalho é criar um **Tech Design Doc (TDD)** focado em qualidade para qualquer nova feature, refatoração ou correção de bug no aplicativo mobile (React Native + Expo). O plano de validação deve obrigatoriamente especificar testes automatizados reais com base nas diretrizes de [qualidade-e-testes.md](file:///c:/bystartup/noonetotalkApp/docs/qualidade-e-testes.md).

## Contexto e Stack Tecnológica Mobile
*   **Plataforma**: React Native + Expo (SDK 54) + TypeScript.
*   **Unitários e Componente**: **Jest** + **React Native Testing Library (RNTL)**.
*   **E2E (Ponta a Ponta)**: **Maestro** (fluxos de teste declarativos via YAML).

---

## Fluxo de Trabalho (Workflow)

Quando solicitado a criar um TDD ou planejar uma tarefa mobile com foco em testes:

1.  **Identifique o Domínio e Mapeie Fluxos Críticos**:
    *   Quais arquivos de componentes, hooks ou services serão criados/modificados?
    *   Quais caminhos o usuário fará no app que podem falhar ou travar?
2.  **Desenhe a Estratégia de Testes**:
    *   *Unitários*: O que testar de lógica pura (custom hooks, funções utilitárias, JWT decode, interceptors)?
    *   *Componentes/Telas*: O que validar na renderização isolada (botões, inputs, modais e seus estados como loading/erro)?
    *   *E2E*: Quais fluxos cruciais precisam de um roteiro de teste ponta a ponta real no simulador/emulador?
3.  **Escreva o TDD**: Siga rigorosamente a estrutura abaixo, inserindo rascunhos práticos de testes reais e prontos para uso.

---

## Estrutura do TDD Mobile

A saída deve seguir rigorosamente a estrutura abaixo:

### 1. Problema e Objetivo Mobile
*(Descreva o problema de negócio ou técnico no aplicativo e o que a entrega realiza.)*

### 2. Arquitetura e Mudanças Propostas
*(Liste os arquivos a serem criados/alterados e as principais definições de código, como interfaces TypeScript, hooks customizados, components e chamadas de serviços/API.)*

### 3. Soluções e Trade-offs
*(Apresente brevemente as abordagens possíveis no React Native e justifique a escolha pela arquitetura adotada.)*

### 4. Riscos e Impactos
*(Identifique gargalos de performance específicos do mobile, re-renders excessivos, quebras de compatibilidade de navegação (Expo Router), comportamento offline ou dependências nativas que podem falhar.)*

### 5. Plano de Validação e Testes Automatizados Mobile (MANDATÓRIO)

Aqui você deve estruturar exatamente como a entrega mobile será testada. **Não seja genérico**.

#### A. Testes Unitários e de Componente (Jest + RNTL)
*   **O que será testado**: *(Lógica isolada, custom hooks, mocks de hooks do Expo Router ou Expo SecureStore, etc.)*
*   **Esboço de Código**:
    ```tsx
    import React from 'react';
    import { render, fireEvent, waitFor } from '@testing-library/react-native';
    // Escreva um rascunho de teste real com Jest/RNTL relevante para a feature mobile
    ```

#### B. Testes E2E (Maestro)
*   **Fluxo de Teste E2E**: *(Descreva o roteiro passo a passo do fluxo no app)*
*   **Rascunho de Script Maestro (`.yaml`)**:
    *   Escreva um arquivo YAML completo e funcional sob a pasta `.maestro/` (ex: `.maestro/nome-da-feature.yaml`).
    ```yaml
    appId: com.bystartup.noonetotalk # ID do app mobile
    ---
    - clearState
    - launchApp
    # Escreva os comandos do Maestro (tapOn, inputText, assertVisible, etc.)
    ```

#### C. Validação Manual e Casos de Borda Mobile
*   *(Exemplos de testes manuais, como perda de conexão à internet, alternar entre temas claro/escuro, preenchimento de campos inválidos ou testes em ambiente de Sandbox para pagamentos In-App Purchases.)*

---

## Regras de Execução

1.  **Não invente seletores no Maestro**: Prefira buscar por texto (`tapOn: "Entrar"`) ou utilize a propriedade `accessibilityLabel` nos componentes React Native (ex: `testID` ou `accessibilityLabel`) para mapeá-los de forma resiliente.
2.  **Escreva testes que funcionam**: Os rascunhos de testes fornecidos no TDD devem ser sintaticamente válidos e prontos para serem adaptados pelo desenvolvedor.
3.  **Use dados realistas**: Evite mocks genéricos como `test1`, `test2`. Use nomes e cenários que simulem o comportamento real dos usuários do No One To Talk (ex: fluxos de talk room, chat real-time, registro de humor).
