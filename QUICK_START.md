# ⚡ Quick Start — 5 Minutos

## 1️⃣ Instalar

```bash
npm install
```

## 2️⃣ Configurar MongoDB

```bash
# macOS
brew services start mongodb-community

# Verificar
mongo --eval "db.adminCommand('ping')"
```

Deve retornar: `{ "ok": 1 }`

## 3️⃣ Variáveis de Ambiente

```bash
cp .env.example .env
```

Confirmar que `.env` tem:
```
MONGODB_URI=mongodb://localhost:27017/gerenciador-provas
```

## 4️⃣ Rodar

```bash
npm run dev
```

Esperar por:
```
[Backend] Servidor rodando em http://localhost:3000
[Frontend] VITE ready in xxx ms ➜  http://localhost:5173
```

## 5️⃣ Testar

### Health-check
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

### Criar Questão
```bash
curl -X POST http://localhost:3000/api/questoes \
  -H "Content-Type: application/json" \
  -d '{
    "enunciado": "Qual é a capital do Brasil?",
    "alternativas": [
      {"descricao": "Brasília", "isCorreta": true},
      {"descricao": "São Paulo", "isCorreta": false},
      {"descricao": "Rio de Janeiro", "isCorreta": false},
      {"descricao": "Belo Horizonte", "isCorreta": false},
      {"descricao": "Curitiba", "isCorreta": false}
    ]
  }'
```

Copiar o `id` retornado.

### Listar Questões
```bash
curl http://localhost:3000/api/questoes
```

### Buscar Questão
```bash
curl http://localhost:3000/api/questoes/{id-copiado}
```

---

## 🌐 URLs Importantes

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Health-check | http://localhost:3000/health |
| MongoDB | mongodb://localhost:27017 |

---

## 📝 Comandos Úteis

### Development
```bash
npm run dev                          # Tudo junto
npm run backend:dev                  # Só backend
npm run frontend:dev                 # Só frontend
```

### Build
```bash
npm run build                        # Tudo
npm run backend:build                # Backend
npm run frontend:build               # Frontend
```

### Testes
```bash
npm run test:bdd                     # BDD (Cucumber)
npm test                             # Unitários
```

### Lint
```bash
npm run lint --workspaces
```

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module..."
```bash
npm --workspace=@gerenciador-provas/shared run build
npm install
```

### MongoDB não conecta
```bash
# Verificar status
brew services list | grep mongodb

# Iniciar
brew services start mongodb-community
```

### Porta 3000 ocupada
Editar `.env`:
```
PORT=3001
```

### Node modules problemático
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Leia Depois

1. [INICIALIZACAO.md](INICIALIZACAO.md) — Setup completo
2. [MONGODB.md](MONGODB.md) — Configuração BD
3. [ARQUITETURA.md](ARQUITETURA.md) — Visão geral
4. [Agent/SKILL.md](Agent/SKILL.md) — Domínio

---

**✅ Você está pronto!** Agora explore os endpoints da API ou abra http://localhost:5173 no navegador.

---

**Dúvida?** Consulte [INICIALIZACAO.md](INICIALIZACAO.md) para troubleshooting detalhado.
