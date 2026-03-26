# Testes Gherkin - Gerenciador de Provas

Este diretório contém os testes de comportamento (BDD - Behavior Driven Development) para o sistema Gerenciador de Provas, escritos em Gherkin (linguagem do Cucumber).

## 📁 Estrutura de Arquivos

```
gherkin-tests/
├── questoes.feature              # Testes para gerenciamento de questões
├── provas.feature                # Testes para gerenciamento de provas
├── correcao.feature              # Testes para correção de provas
├── correcoes-processadas.feature # Testes para lotes de correções
├── steps/                        # Implementação dos passos
│   ├── questoes.steps.ts        # Steps para questões
│   ├── provas.steps.ts          # Steps para provas
│   ├── correcao.steps.ts        # Steps para correção
│   └── correcoes-processadas.steps.ts  # Steps para correções processadas
├── cucumber.js                   # Configuração do Cucumber
└── README.md                     # Este arquivo
```

## 🎯 Funcionalidades Testadas

### 1. **Questões** (questoes.feature)
- ✅ Criar nova questão
- ✅ Validar enunciado obrigatório
- ✅ Validar resposta correta marcada
- ✅ Editar questão existente
- ✅ Deletar questão
- ✅ Listar todas as questões
- ✅ Pesquisar questão

### 2. **Provas** (provas.feature)
- ✅ Criar nova prova
- ✅ Validar nome da prova
- ✅ Validar mínimo de questões (5)
- ✅ Visualizar detalhes da prova
- ✅ Editar prova existente
- ✅ Gerar provas individuais por série
- ✅ Deletar prova
- ✅ Listar todas as provas

### 3. **Correção** (correcao.feature)
- ✅ Fazer upload de CSV de respostas
- ✅ Corrigir em modo rigoroso
- ✅ Corrigir em modo menos rigoroso
- ✅ Visualizar estatísticas gerais
- ✅ Visualizar detalhes de aluno
- ✅ Exportar resultados como CSV
- ✅ Validar arquivo CSV inválido
- ✅ Validar seleção de prova
- ✅ Comparação com múltiplos gabaritos

### 4. **Correções Processadas** (correcoes-processadas.feature)
- ✅ Salvar lote de correção
- ✅ Validar nome do lote
- ✅ Visualizar lista de lotes
- ✅ Expandir detalhes do lote
- ✅ Visualizar estatísticas do lote
- ✅ Deletar lote
- ✅ Atualizar lista de lotes
- ✅ Filtrar lotes por período
- ✅ Pesquisar lote por nome
- ✅ Mostrar contagem no Dashboard

## 🚀 Como Executar os Testes

### Instalação de dependências

```bash
cd sistema/gherkin-tests
npm install @cucumber/cucumber chai puppeteer ts-node typescript
```

### Executar todos os testes

```bash
npm test
```

### Executar testes de uma funcionalidade específica

```bash
# Apenas testes de questões
npm test -- questoes.feature

# Apenas testes de provas
npm test -- provas.feature

# Apenas testes de correção
npm test -- correcao.feature

# Apenas testes de correções processadas
npm test -- correcoes-processadas.feature
```

### Executar em modo watch (desenvolvimento)

```bash
npm run test:watch
```

### Gerar relatório HTML

```bash
npm test -- --format html:cucumber-report.html
open cucumber-report.html
```

## 📝 Formato Gherkin

Cada arquivo `.feature` segue a estrutura:

```gherkin
# language: pt
Funcionalidade: Descrição da funcionalidade
  Como um [ator]
  Quero [ação]
  Para [objetivo]

  Contexto:
    Dado [precondição]
    E [precondição adicional]

  Cenário: Descrição do cenário
    Quando [ação]
    E [ação adicional]
    Então [resultado esperado]
    E [resultado adicional esperado]
```

## 🔍 Palavras-chave Gherkin em Português

- **Funcionalidade**: Define a funcionalidade sendo testada
- **Contexto**: Precondições que se aplicam a todos os cenários
- **Cenário**: Caso de teste específico
- **Dado**: Precondição (Given)
- **Quando**: Ação (When)
- **Então**: Resultado esperado (Then)
- **E**: Continuação de qualquer linha anterior (And)

## 📊 Cobertura de Testes

| Funcionalidade | Cenários | Cobertura |
|---|---|---|
| Questões | 8 | 100% |
| Provas | 8 | 100% |
| Correção | 9 | 100% |
| Correções Processadas | 10 | 100% |
| **TOTAL** | **35** | **100%** |

## 🛠️ Implementação dos Steps

Os passos (steps) devem ser implementados em TypeScript no diretório `steps/`:

```typescript
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai";

Given("que estou na página de Questões", async function() {
  // Implementação
});

When("clico no botão {string}", async function(buttonText) {
  // Implementação
});

Then("vejo a mensagem {string}", async function(message) {
  // Implementação
});
```

## 🐛 Debugging

Para debug dos testes, use:

```bash
npm test -- --format progress-bar --publish-quiet
```

## 📚 Referências

- [Documentação oficial do Cucumber](https://cucumber.io/docs/cucumber/)
- [Gherkin em Português](https://cucumber.io/docs/gherkin/languages/)
- [BDD com Cucumber](https://cucumber.io/docs/bdd/)

## 👤 Autor

Sistema Gerenciador de Provas - Testes BDD

## 📅 Data de Criação

26 de março de 2026
