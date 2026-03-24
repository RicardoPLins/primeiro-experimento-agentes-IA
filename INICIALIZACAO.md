# Guia de Inicialização — Gerenciador de Provas

## Pré-requisitos

- **Node.js**: v20+ (recomendado v20.10.0+)
- **npm**: v10+ (incluído com Node.js)
- **MongoDB**: v7+ instalado localmente ou acesso a instância remota
- **Git**: para controle de versão

## Instalação Inicial

### 1. Clonar o repositório e instalar dependências

```bash
git clone <repository-url>
cd primeiro-experimento-agentes-IA
npm install
```

Este comando instala as dependências de todos os workspaces (shared, backend, frontend).

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

**Configurar MongoDB localmente:**

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/gerenciador-provas
MONGODB_DB_NAME=gerenciador-provas
MONGODB_POOL_MIN=5
MONGODB_POOL_MAX=10
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000
```

**Para usar MongoDB remoto (ex: MongoDB Atlas):**

```bash
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/gerenciador-provas?retryWrites=true&w=majority
```

### 3. Instalar e iniciar MongoDB localmente

**macOS (com Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verificar se MongoDB está rodando:**

```bash
mongo --eval "db.adminCommand('ping')"
```

Deve retornar: `{ ok: 1 }`

## Estrutura do Monorepo

```
packages/
  shared/       # Tipos de domínio compartilhados
  backend/      # API REST (Node.js + Express + MongoDB)
  frontend/     # Frontend (React 18 + Vite + TypeScript)
tests/
  features/     # Testes BDD (Gherkin em português)
  steps/        # Implementações dos passos dos testes
```

## Executar o Projeto

### Modo desenvolvimento (simultaneamente frontend + backend)

```bash
npm run dev
```

Isso iniciará:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173

### Executar apenas backend

```bash
npm run backend:dev
```

Acesse `http://localhost:3000/health` para verificar status do servidor.

### Executar apenas frontend

```bash
npm run frontend:dev
```

### Build para produção

```bash
npm run build
# ou
npm run backend:build
npm run frontend:build
```

## Testes

### Rodar testes BDD (Cucumber/Gherkin)

```bash
npm run test:bdd
```

### Rodar testes unitários

```bash
npm test --workspaces
```

## Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm --workspace=@gerenciador-provas/backend run dev

# Build
npm --workspace=@gerenciador-provas/backend run build

# Testes BDD
npm --workspace=@gerenciador-provas/backend run test:bdd

# Lint
npm --workspace=@gerenciador-provas/backend run lint
```

### Frontend

```bash
# Desenvolvimento
npm --workspace=@gerenciador-provas/frontend run dev

# Build
npm --workspace=@gerenciador-provas/frontend run build

# Lint
npm --workspace=@gerenciador-provas/frontend run lint
```

### Shared (tipos compartilhados)

```bash
# Build
npm --workspace=@gerenciador-provas/shared run build

# Watch
npm --workspace=@gerenciador-provas/shared run dev
```

## Arquitetura — Fluxo de Dados

### 1. **Frontend → Backend (HTTP)**

```
React App (http://localhost:5173)
    ↓
  Axios / React Query
    ↓
Express API (http://localhost:3000/api/*)
```

### 2. **Backend → MongoDB**

```
Express Controllers
    ↓
Services (lógica de domínio)
    ↓
Repositories (acesso ao banco)
    ↓
MongoDB Schemas (Mongoose)
    ↓
MongoDB Collections
```

### 3. **Padrão Repository**

Todo acesso ao banco passa por repositórios:

```
QuestaoRepository
  ├── criar(questao)
  ├── buscarPorId(id)
  ├── listarTodas()
  ├── atualizar(id, atualizacoes)
  ├── excluir(id)
  └── ...
```

## Endpoints da API

### Questões

- `GET /api/questoes` — Listar todas
- `POST /api/questoes` — Criar
- `GET /api/questoes/:id` — Buscar por ID
- `PUT /api/questoes/:id` — Atualizar
- `DELETE /api/questoes/:id` — Excluir

### Provas

- `GET /api/provas` — Listar todas
- `POST /api/provas` — Criar
- `GET /api/provas/:id` — Buscar por ID
- `PUT /api/provas/:id` — Atualizar
- `DELETE /api/provas/:id` — Excluir

## Debugging

### Health-check do Backend

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{
  "status": "ok",
  "timestamp": "2024-03-24T10:00:00.000Z",
  "database": "connected"
}
```

### Logs do MongoDB

Se usar `brew services`, os logs estão em:

```bash
/usr/local/var/log/mongodb/mongo.log
```

## Troubleshooting

### Erro: "Cannot find module '@gerenciador-provas/shared'"

Certifique-se de que o shared foi buildado:

```bash
npm --workspace=@gerenciador-provas/shared run build
```

### Erro: "MongoDB connection failed"

Verifique se MongoDB está rodando:

```bash
# macOS
brew services list | grep mongodb

# Linux (systemctl)
systemctl status mongod
```

### Erro: "Port 3000 already in use"

Mude a porta no `.env`:

```bash
PORT=3001
```

### Erro: "EACCES: permission denied" no npm

Não use `sudo`. Se necessário:

```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## Estrutura de Pastas Explicada

| Pasta | Propósito |
|-------|-----------|
| `packages/shared/src/types/` | Tipos TypeScript compartilhados |
| `packages/backend/src/database/` | Conexão MongoDB e schemas |
| `packages/backend/src/repositories/` | Padrão Repository (acesso dados) |
| `packages/backend/src/services/` | Lógica de domínio |
| `packages/backend/src/controllers/` | Handlers HTTP |
| `packages/backend/src/routes/` | Definição das rotas |
| `packages/backend/src/errors/` | Classes de erros |
| `packages/frontend/src/` | Componentes React |
| `tests/features/` | Testes Gherkin (.feature) |
| `tests/steps/` | Implementações dos passos |

## Próximos Passos

1. ✅ Backend estruturado com Controllers, Services, Repositories
2. ✅ MongoDB configurado com schemas validados
3. ✅ Tipos compartilhados entre frontend/backend
4. ⏳ Implementar Geração de PDF com embaralhamento
5. ⏳ Implementar Motor de Correção
6. ⏳ Desenvolver Frontend completo com formulários
7. ⏳ Implementar Testes BDD

## Referências

- [SKILL.md](../Agent/SKILL.md) — Domínio e convenções do projeto
- [project-config.yaml](../Agent/project-config.yaml) — Configuração do projeto
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [React 18](https://react.dev/)
- [Cucumber.js](https://cucumber.io/docs/cucumber/)

---

**Última atualização**: 24 de março de 2026
