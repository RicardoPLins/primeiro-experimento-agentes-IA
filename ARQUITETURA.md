# Gerenciador de Provas

Sistema completo de gerenciamento de provas de múltipla escolha com geração de PDFs embaralhados e correção automatizada.

## 🎯 Objetivo

Fornecer uma ferramenta robusta para professores:
- ✅ Gerenciar questões de múltipla escolha
- ✅ Montar provas template
- ✅ Gerar variantes embaralhadas em PDF
- ✅ Corrigir respostas automaticamente (modo rigoroso ou proporcional)
- ✅ Gerar relatórios de notas

## 🏗️ Arquitetura

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend** | Node.js 20 + Express + TypeScript |
| **Banco de Dados** | MongoDB 7+ |
| **Testes** | Cucumber/Gherkin (BDD) |
| **Build** | npm workspaces (monorepo) |

### Estrutura de Pastas

```
packages/
  shared/       # Tipos TypeScript compartilhados
  backend/      # API REST + lógica de domínio
  frontend/     # Interface React
tests/
  features/     # Testes BDD (.feature)
  steps/        # Implementações dos passos
Agent/          # Documentação de skills
```

## 🚀 Quick Start

### 1. Instalação

```bash
npm install
cp .env.example .env
```

### 2. Iniciar MongoDB

```bash
# macOS
brew services start mongodb-community

# Verificar
mongo --eval "db.adminCommand('ping')"
```

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000/api
- **Health-check**: http://localhost:3000/health

## 📋 Funcionalidades Implementadas

### ✅ Backend

- [x] Estrutura com Controllers, Services, Repositories
- [x] Conexão centralizada MongoDB com retry exponencial
- [x] Schemas com índices apropriados
- [x] CRUD de Questões com validações
- [x] CRUD de Provas com regras de negócio
- [x] Tratamento de erros centralizado
- [x] Health-check e graceful shutdown

### ⏳ Em Desenvolvimento

- [ ] Geração de PDF com embaralhamento
- [ ] Motor de correção (rigoroso/proporcional)
- [ ] Importação de respostas CSV
- [ ] Relatórios de notas
- [ ] Frontend completo
- [ ] Testes BDD

## 🔑 Conceitos-Chave

### Questão
Uma questão fechada com **exatamente 5 alternativas**, sendo pelo menos uma correta.

### Prova (Template)
Exame configurado com **5 questões** em modo de identificação (LETRAS ou POTÊNCIAS DE 2).

### Prova Individual
Instância concreta de uma prova com **embaralhamento único** de questões e alternativas.

### Gabarito
Respostas corretas de uma prova individual, persistidas para reprodutibilidade.

### Identificação
- **LETRAS**: Aluno marca A, B, C, D, E (resultado: "AC" = A e C corretas)
- **POTÊNCIAS_DE_2**: Aluno marca 1, 2, 4, 8, 16 (resultado: "6" = 2+4 corretas)

### Modo de Correção
- **RIGOROSA**: Uma alternativa errada ou omitida = questão inteira = 0
- **MENOS_RIGOROSA**: Nota proporcional ao percentual de alternativas corretas

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [INICIALIZACAO.md](INICIALIZACAO.md) | Passo-a-passo de setup e comandos |
| [MONGODB.md](MONGODB.md) | Configuração MongoDB, schemas, boas práticas |
| [Agent/SKILL.md](Agent/SKILL.md) | Vocabulário de domínio e convenções |
| [Agent/project-config.yaml](Agent/project-config.yaml) | Configuração centralizada do projeto |

## 🔌 API REST

### Questões

```bash
# Criar
POST /api/questoes
Content-Type: application/json
{
  "enunciado": "Qual é a capital do Brasil?",
  "alternativas": [
    { "descricao": "Brasília", "isCorreta": true },
    { "descricao": "São Paulo", "isCorreta": false },
    ...
  ]
}

# Listar
GET /api/questoes

# Buscar
GET /api/questoes/{id}

# Atualizar
PUT /api/questoes/{id}

# Excluir
DELETE /api/questoes/{id}
```

### Provas

```bash
# Criar
POST /api/provas
{
  "nome": "Prova de Matemática",
  "disciplina": "Matemática",
  "professor": "João Silva",
  "data": "2024-04-01",
  "turma": "3º A",
  "identificacao": "LETRAS",
  "questoesIds": ["id1", "id2", "id3", "id4", "id5"]
}

# Listar
GET /api/provas

# Buscar
GET /api/provas/{id}

# Atualizar
PUT /api/provas/{id}

# Excluir
DELETE /api/provas/{id}
```

## ✅ Testes BDD

Todos os testes em português do Brasil, formatoGherkin:

```bash
npm run test:bdd
```

Cenários cobrem:
- ✅ Caminho feliz (sucesso)
- ✅ Validação (entrada inválida)
- ✅ Não encontrado / conflito
- ✅ Integridade referencial

## 🛡️ Padrões de Qualidade

### Padrão Repository
Todos os acessos ao banco passam por repositórios tipados, sem SQL/queries inline.

### Padrão Service
Lógica de domínio centralizada, testável e reutilizável.

### Padrão Controller
Controllers tratam HTTP, delegam lógica para services.

### Erros Tipados
Classe `ApplicationError` com `code`, `message`, `statusCode` e `details`.

### Integridade Referencial
Garantida na camada de serviço (MongoDB não possui FK nativo).

## 🔒 Segurança

- ✅ Variáveis de ambiente não commitadas (`.env` ignorado)
- ✅ Validação de entrada em todos os endpoints
- ✅ Dados sensíveis não expostos em logs
- ✅ Helmet para headers HTTP
- ✅ CORS configurável
- ✅ Pool de conexões MongoDB configurável

## 📊 Health-Check

```bash
curl http://localhost:3000/health

{
  "status": "ok",
  "timestamp": "2024-03-24T10:00:00.000Z",
  "database": "connected"
}
```

## 🐛 Troubleshooting

### Dependências não encontradas

```bash
npm --workspace=@gerenciador-provas/shared run build
npm install
```

### MongoDB não conecta

```bash
# Verificar se está rodando
brew services list | grep mongodb

# Iniciar
brew services start mongodb-community
```

### Porta ocupada

```bash
# .env
PORT=3001  # Mudar porta
```

## 👨‍💼 Roles e Responsabilidades (Dentro do Backend)

| Componente | Responsabilidade |
|-----------|-----------------|
| **Controller** | Recebe requisição HTTP, chama service, retorna resposta |
| **Service** | Lógica de domínio, validações, orquestração |
| **Repository** | Acesso ao banco de dados |
| **Schema** | Definição de modelo MongoDB |

## 📈 Próximas Fases

### Fase 1 (Atual)
- [x] Estrutura monorepo
- [x] Backend com CRUD básico
- [x] MongoDB configurado
- [x] Testes BDD (features definidas)

### Fase 2
- [ ] Geração de PDF
- [ ] Motor de embaralhamento
- [ ] Exportação de gabarito CSV

### Fase 3
- [ ] Motor de correção
- [ ] Importação de respostas CSV
- [ ] Relatórios de notas

### Fase 4
- [ ] Frontend React completo
- [ ] Integração com backend
- [ ] Deploy em produção

## 📝 Convenções de Código

- **Idioma**: TypeScript stricto
- **Formatação**: ESLint + Prettier (a configurar)
- **Commits**: Convenção Angular (`feat:`, `fix:`, `docs:`, etc)
- **Branches**: `feature/*`, `bugfix/*`, `docs/*`
- **Testes**: BDD em português do Brasil

## 📞 Suporte

Para dúvidas sobre:
- **Domínio**: Consulte [SKILL.md](Agent/SKILL.md)
- **Setup**: Consulte [INICIALIZACAO.md](INICIALIZACAO.md)
- **MongoDB**: Consulte [MONGODB.md](MONGODB.md)
- **Configuração geral**: Consulte [project-config.yaml](Agent/project-config.yaml)

---

**Última atualização**: 24 de março de 2026  
**Versão**: 1.0.0 (alpha)
