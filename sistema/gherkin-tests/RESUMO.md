# Estrutura de Testes Gherkin - Resumo

## 📋 Visão Geral

A pasta `gherkin-tests` contém **35 cenários de teste** em Gherkin/Cucumber, organizados em 4 arquivos feature:

### 📁 Arquivos de Testes (.feature)

#### 1. **questoes.feature** (8 cenários)
Testes para a funcionalidade de gerenciamento de questões:
- ✅ Criar questão válida
- ✅ Validações (enunciado obrigatório, resposta correta)
- ✅ Editar e deletar questões
- ✅ Listar e pesquisar questões

#### 2. **provas.feature** (8 cenários)
Testes para a funcionalidade de gerenciamento de provas:
- ✅ Criar prova com validações
- ✅ Editar e deletar provas
- ✅ Gerar provas individuais por série
- ✅ Visualizar detalhes de prova

#### 3. **correcao.feature** (9 cenários)
Testes para a funcionalidade de correção:
- ✅ Upload de CSV (validação de formato)
- ✅ Correção em modo rigoroso e menos rigoroso
- ✅ Visualizar estatísticas e detalhes
- ✅ Exportar resultados
- ✅ Comparação com múltiplos gabaritos

#### 4. **correcoes-processadas.feature** (10 cenários)
Testes para gerenciamento de lotes processados:
- ✅ Salvar lote com validações
- ✅ Visualizar e expandir detalhes
- ✅ Deletar lote
- ✅ Filtrar e pesquisar lotes
- ✅ Mostrar contagem no Dashboard

### 📂 Estrutura de Arquivos

```
sistema/gherkin-tests/
├── questoes.feature              (8 cenários)
├── provas.feature                (8 cenários)
├── correcao.feature              (9 cenários)
├── correcoes-processadas.feature (10 cenários)
├── steps/
│   └── common.steps.ts           (implementação dos passos)
├── package.json                  (dependências e scripts)
├── cucumber.js                   (configuração)
└── README.md                     (documentação detalhada)
```

## 🎯 Cobertura de Funcionalidades

| Funcionalidade | Cenários | Cobertura |
|---|---|---|
| **Questões** | 8 | Criar, editar, deletar, listar, pesquisar, validações |
| **Provas** | 8 | Criar, editar, deletar, gerar individuais, visualizar |
| **Correção** | 9 | Upload, modos, estatísticas, exportar, validações |
| **Correções Processadas** | 10 | Salvar, visualizar, expandir, deletar, filtrar, pesquisar |
| **TOTAL** | **35** | **100% das funcionalidades** |

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
cd sistema/gherkin-tests
npm install
```

### 2. Executar Testes

```bash
# Todos os testes
npm test

# Apenas uma funcionalidade
npm run test:questoes
npm run test:provas
npm run test:correcao
npm run test:processadas

# Em paralelo
npm run test:parallel

# Gerar relatório HTML
npm run report
```

### 3. Desenvolvendo Novos Testes

- Adicione novos cenários no arquivo `.feature` correspondente
- Implemente os passos em `steps/common.steps.ts`
- Execute com `npm test`

## 📝 Exemplo de Cenário

```gherkin
Cenário: Criar uma nova questão com sucesso
  Quando clico no botão "Adicionar Questão"
  E preencho o campo de enunciado com "Qual é a capital do Brasil?"
  E preencho a alternativa "A" com "São Paulo"
  E preencho a alternativa "B" com "Brasília"
  E marco a alternativa "B" como correta
  E clico em "Salvar"
  Então vejo a mensagem "Questão salva com sucesso"
  E a questão aparece na lista de questões
```

## 🔧 Tecnologias Utilizadas

- **Cucumber.js**: Framework de BDD
- **Gherkin**: Linguagem de testes (em português)
- **Puppeteer**: Automação de navegador
- **Chai**: Assertions
- **TypeScript**: Tipagem estática

## 📚 Características

✅ Testes em português (Gherkin pt-BR)
✅ Cobertura completa de funcionalidades
✅ Execução paralela
✅ Relatórios HTML
✅ Fácil manutenção
✅ Baseado em comportamento (BDD)

## 🎓 Próximos Passos

1. Instalar dependências do projeto gherkin-tests
2. Configurar base URL da aplicação
3. Executar testes contra ambiente de desenvolvimento
4. Integrar CI/CD (GitHub Actions, Jenkins, etc)
5. Gerar relatórios periódicos

## 📞 Suporte

Para dúvidas sobre os testes ou para adicionar novos cenários, consulte:
- [Documentação Cucumber](https://cucumber.io/docs/)
- [Gherkin em Português](https://cucumber.io/docs/gherkin/languages/)
- README.md neste diretório

---

**Criado em**: 26 de março de 2026
**Total de Cenários**: 35
**Cobertura**: 100% das funcionalidades do sistema
