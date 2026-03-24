---
name: gerenciador-provas
description: >
  Guia de domínio e arquitetura para o sistema Gerenciador de Provas.
  Use esta skill ao trabalhar em qualquer funcionalidade, spec, design ou tarefa relacionada a
  gerenciamento de questões, montagem de provas, geração de PDF ou correção de provas.
  Fornece vocabulário de domínio, regras de negócio, convenções de arquivos e padrões de
  testes específicos deste projeto.
---

# Gerenciador de Provas — Skill do Projeto

Esta skill concentra o conhecimento de domínio, convenções arquiteturais e padrões de
codificação/testes do sistema. Leia-a antes de escrever qualquer spec, projetar qualquer
componente ou gerar qualquer lista de tarefas.

---

## 1. Vocabulário de Domínio

| Termo | Significado |
|---|---|
| **Questão** | Uma questão fechada: um enunciado + 5 alternativas |
| **Alternativa** | Uma opção de resposta dentro de uma Questão; possui `descricao` e `isCorreta: boolean` |
| **Prova (template)** | O exame configurado: um conjunto ordenado de Questões + modo de `identificacao` |
| **Prova individual** | Uma instância concreta embaralhada em PDF; identificada por `numero` (inteiro sequencial) |
| **Gabarito** | O gabarito de respostas de uma Prova individual |
| **Gabarito CSV** | Arquivo exportado após a geração do PDF; uma linha por Prova individual |
| **Respostas CSV** | Arquivo com respostas dos alunos (tipicamente do Google Forms); uma linha por aluno |
| **Identificação LETRAS** | Alternativas rotuladas A, B, C…; espaço de resposta = linha em branco para o aluno escrever as letras |
| **Identificação POTÊNCIAS** | Alternativas rotuladas 1, 2, 4, 8…; espaço de resposta = linha em branco para a soma numérica |

---

## 2. Regras de Negócio Principais

### 2.1 Questão
- Uma Questão DEVE ter um `enunciado` não vazio.
- Uma Questão DEVE ter pelo menos 5 Alternativas.
- Pelo menos uma Alternativa DEVE ter `isCorreta = true`.
- Excluir uma Questão referenciada por alguma Prova template DEVE ser bloqueado (ou exibir aviso e cascatear — definir na spec).

### 2.2 Prova template
- Uma Prova template DEVE referenciar 5 Questões.
- `identificacao` é um enum: `LETRAS | POTENCIAS_DE_2`.
- A ordem das questões no template é a ordem canônica; o embaralhamento ocorre apenas no momento da geração do PDF.

### 2.3 Geração de PDF — embaralhamento
- Cada Prova individual recebe uma **ordem embaralhada única** tanto das questões quanto das alternativas.
- O mapeamento `(numero_prova, posição_na_prova) → (questao_id, alternativa_ids[])` DEVE ser persistido para que o gabarito possa ser calculado.
- O embaralhamento DEVE usar um RNG com semente baseada em `numero_prova` para garantir reprodutibilidade.
- Campos do cabeçalho: nome da disciplina, professor, data, turma (todos configuráveis por Prova template).
- Rodapé: `numero_prova` aparece em todas as páginas.
- Final do PDF: espaço em branco para nome e CPF do aluno.
- Espaço de resposta por questão:
  - LETRAS → linhas rotuladas em branco para o aluno escrever as letras
  - POTENCIAS_DE_2 → único campo em branco para a soma numérica

### 2.4 Formato do Gabarito CSV
```
numero_prova,q1,q2,q3,...
1,AC,B,ABD,...          # modo LETRAS: string de letras ordenadas
1,6,1,3,...             # modo POTENCIAS_DE_2: soma inteira
```
Uma linha de cabeçalho. Uma linha de dados por Prova individual.

### 2.5 Respostas CSV (entrada do Google Forms)
```
timestamp,email,numero_prova,q1,q2,q3,...
```
O sistema DEVE tolerar colunas iniciais extras (timestamp, email) e DEVE associar as
questões pela posição da coluna, não pelo nome da coluna.

### 2.6 Modos de correção
| Modo | Regra |
|---|---|
| **Rigorosa** | Qualquer seleção incorreta OU omissão em qualquer alternativa → questão inteira = 0 |
| **Menos rigorosa** | Nota = (alternativas_tratadas_corretamente / total_alternativas) × peso_da_questão |

- Saída do relatório de notas: uma linha por aluno, colunas = [nome, CPF, nota_final, nota_q1, nota_q2, …]
- Por padrão, todas as questões têm peso igual; peso por questão PODE ser adicionado em spec futura.

---

## 3. Arquitetura

### 3.1 Estrutura do monorepo
```
packages/
  shared/       # Tipos de domínio (Questao, Alternativa, Prova, ProvaIndividual, etc.)
  backend/      # API REST Node.js + Express (ou Fastify)
  frontend/     # SPA React 18 + TypeScript
tests/
  features/     # Arquivos Gherkin .feature, agrupados por domínio
    questoes/
    provas/
    pdf/
    correcao/
  steps/        # Definições de passos em TypeScript
    questoes/
    provas/
    pdf/
    correcao/
```

### 3.2 Convenções do Backend
- Controllers tratam o HTTP; Services contêm a lógica de domínio; sem lógica de domínio em controllers.
- Services retornam resultados tipados — nunca linhas brutas do banco.
- Todos os IDs são UUIDs (v4).
- Erros usam uma classe `AppError` tipada com string `code` e status HTTP.
- Parsing de CSV fica em um service dedicado `CsvParser` — não inline em controllers.
- Persistência DEVE seguir padrão Repository (`QuestaoRepository`, `ProvaRepository`, etc.), sem acesso direto ao MongoDB dentro de controllers/services.

### 3.3 Persistência MongoDB (Backend)

#### 3.3.1 Stack e configuração
- Banco padrão do projeto: **MongoDB 7+**.
- Driver recomendado: **Mongoose** (ou driver oficial MongoDB quando explicitamente necessário).
- Variáveis de ambiente obrigatórias no backend:
  - `MONGODB_URI` (string de conexão)
  - `MONGODB_DB_NAME` (nome lógico do banco)
  - `MONGODB_POOL_MIN` e `MONGODB_POOL_MAX` (pool de conexões)
  - `MONGODB_SERVER_SELECTION_TIMEOUT_MS`
- A inicialização da conexão DEVE ocorrer em um módulo único (`database/mongo.ts`) com retry exponencial e fail-fast quando não conectar.

#### 3.3.2 Modelagem e coleções
- Coleções sugeridas:
  - `questoes`
  - `provas`
  - `provas_individuais`
  - `gabaritos`
  - `correcoes`
- Cada documento DEVE ter:
  - `_id` (ObjectId interno)
  - `id` (UUID v4 de domínio, público)
  - `createdAt`, `updatedAt`
- O campo `id` DEVE possuir índice único (`unique index`) em todas as coleções de domínio.
- Em `provas_individuais`, índice composto DEVE existir para `(provaId, numero)`.
- O mapeamento de embaralhamento DEVE ser persistido para reprodutibilidade e auditoria.

#### 3.3.3 Regras de integridade e desempenho
- Integridade referencial DEVE ser garantida na camada de serviço (MongoDB não impõe FK nativamente).
- Exclusão de `Questão` referenciada por `Prova` DEVE ser bloqueada por regra de domínio.
- Operações multi-documento críticas (ex.: geração em lote de provas + gabaritos) DEVEM usar transações com `session`.
- Consultas frequentes DEVERIAM ter índices explícitos revisados por domínio de uso.
- Campos grandes (ex.: conteúdo de PDF em binário) NÃO DEVEM ser salvos na mesma coleção de domínio; usar armazenamento externo + referência.

#### 3.3.4 Segurança e observabilidade
- `MONGODB_URI` NÃO DEVE ser commitado; usar `.env` e cofre de segredos no ambiente alvo.
- Logs NÃO DEVEM expor credenciais nem dados sensíveis de alunos (CPF completo, e-mail completo).
- Health-check do backend DEVE validar estado da conexão MongoDB.

#### 3.3.5 Testes com MongoDB
- Testes de integração de repositório/serviço DEVEM usar MongoDB isolado por teste (ex.: `mongodb-memory-server`).
- Cada cenário de teste DEVE limpar coleções entre execuções para evitar acoplamento.
- Cenários de erro DEVEM cobrir: timeout de conexão, índice único violado e documento não encontrado.

### 3.4 Convenções do Frontend
- Estado: React Query para estado do servidor; Zustand ou Context para estado local de UI.
- Formulários: React Hook Form + validação com Zod.
- Roteamento: React Router v6.
- Pré-visualização de PDF: embed do PDF gerado em `<iframe>` ou uso de `react-pdf`.
- Sem lógica de domínio em componentes — delegar para hooks customizados ou módulos de service.

### 3.5 Tipos compartilhados
Definir entidades de domínio uma única vez em `packages/shared/src/types/`:
```ts
// Exemplo — adaptar conforme implementado
export interface Alternativa {
  id: string;
  descricao: string;
  isCorreta: boolean;
}

export interface Questao {
  id: string;
  enunciado: string;
  alternativas: Alternativa[];
}

export type Identificacao = 'LETRAS' | 'POTENCIAS_DE_2';

export interface Prova {
  id: string;
  nome: string;
  disciplina: string;
  professor: string;
  identificacao: Identificacao;
  questoes: Questao[];
}
```

---

## 4. Convenções de Testes (Cucumber/Gherkin)

### 4.1 Idioma
Todos os arquivos `.feature` DEVEM ser escritos em **português do Brasil**.
Usar `# language: pt` no topo de cada arquivo.

```gherkin
# language: pt
Funcionalidade: Gerenciamento de questões

  Cenário: Criar uma questão com alternativas válidas
    Dado que o sistema não possui questões cadastradas
    Quando o usuário cria uma questão com enunciado "Qual é a capital do Brasil?"
    E adiciona a alternativa "Brasília" marcada como correta
    E adiciona a alternativa "São Paulo" marcada como incorreta
    Então a questão deve ser salva com sucesso
    E o sistema deve listar 1 questão cadastrada
```

### 4.2 Localização dos arquivos de feature
| Domínio | Caminho |
|---|---|
| Questões | `tests/features/questoes/*.feature` |
| Provas | `tests/features/provas/*.feature` |
| Geração de PDF | `tests/features/pdf/*.feature` |
| Correção | `tests/features/correcao/*.feature` |

### 4.3 Cobertura obrigatória de cenários
Toda funcionalidade DEVE ter cenários para:
- Caminho feliz (sucesso)
- Erro de validação (entrada inválida)
- Não encontrado / conflito (entidade ausente ou duplicada)

A geração de PDF DEVE ter cenários separados para os modos LETRAS e POTENCIAS_DE_2.

A correção DEVE ter cenários separados para os modos rigoroso e menos rigoroso, e um
cenário para entrada CSV malformada.

### 4.4 Definições de passos
- Um arquivo TypeScript por domínio em `tests/steps/<dominio>/`.
- Os passos usam diretamente a camada de service da aplicação (testes de integração), não HTTP.
- Testes no nível HTTP são uma camada separada (ex: Supertest) e ficam em `tests/api/`.

---

## 5. Referência de IDs de Invariante

| Prefixo | Domínio |
|---|---|
| INV-QST-NN | Questões |
| INV-PRV-NN | Provas (template) |
| INV-PDF-NN | Geração de PDF |
| INV-COR-NN | Correção |
| INV-FRT-NN | Frontend |
| INV-BKD-NN | Backend |
| INV-TST-NN | Testes |

---

## 6. Checklist — Antes de Entregar Qualquer Spec ou Tarefa

- [ ] A spec usa palavras-chave RFC 2119 em português (DEVE, NÃO DEVE, DEVERIA, PODE)
- [ ] Todos os cenários seguem DADO/QUANDO/ENTÃO/E em português do Brasil
- [ ] IDs de invariante estão atribuídos e seguem o formato INV-XXX-NN
- [ ] Regras de negócio para o modo de identificação (LETRAS vs POTÊNCIAS DE 2) estão explícitas
- [ ] Modo de correção (rigorosa vs menos rigorosa) está especificado onde relevante
- [ ] Formato do CSV (colunas, codificação, casos extremos) está documentado para toda funcionalidade que toca CSV
- [ ] Estratégia de persistência MongoDB (coleções, índices, transações e integridade) está explícita nas specs/tarefas afetadas
- [ ] Uma tarefa de arquivo `.feature` correspondente está incluída para cada tarefa de lógica de domínio
- [ ] A lista de tarefas termina com um grupo de Verificação