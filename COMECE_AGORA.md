# 🎬 Começar Agora — Gerenciador de Provas

## ⚡ 5 Minutos para Rodar

### 1. Setup Inicial (2 min)

```bash
# Instalar dependências
npm install

# Copiar config de ambiente
cp .env.example .env

# Iniciar MongoDB (se usar local)
brew services start mongodb-community
```

### 2. Iniciar Sistema (1 min)

```bash
# Terminal 1: Backend
npm run backend:dev

# Terminal 2: Frontend
npm run frontend:dev

# OU ambos simultaneamente
npm run dev
```

### 3. Acessar (2 min)

```
Backend:  http://localhost:3000/health  ✅
Frontend: http://localhost:5173         📱
```

## 🎯 Primeiro Teste

### Criar Questão
1. Acesse http://localhost:5173
2. Clique em **❓ Questões** (sidebar)
3. Clique em **➕ Nova Questão**
4. Preencha o formulário (mínimo 5 alternativas)
5. Clique em **Salvar Questão**

### Criar Prova
1. Clique em **📄 Provas** (sidebar)
2. Clique em **➕ Nova Prova**
3. Preencha dados básicos
4. Selecione **EXATAMENTE 5 questões**
5. Clique em **Salvar Prova**

### Visualizar Prova
1. Na lista de provas, clique em **👁️ Visualizar**
2. Veja todas as questões e gabarito

## 📁 Estrutura Rápida

```
packages/
  ├─ shared/      ← Tipos compartilhados
  ├─ backend/     ← API Express + MongoDB
  └─ frontend/    ← React SPA

tests/
  ├─ features/    ← Testes BDD (Gherkin)
  └─ steps/       ← Implementações
```

## 🔗 URLs Importantes

| URL | Descrição |
|-----|-----------|
| http://localhost:3000/health | Health-check API |
| http://localhost:3000/api/questoes | Lista questões |
| http://localhost:3000/api/provas | Lista provas |
| http://localhost:5173 | Frontend |
| http://localhost:5173/questoes | Página questões |
| http://localhost:5173/provas | Página provas |

## 🛠️ Comandos Principais

```bash
# Development
npm run dev                    # Backend + Frontend
npm run backend:dev            # Backend only
npm run frontend:dev           # Frontend only

# Build
npm run build                  # Tudo
npm run backend:build          # Backend
npm run frontend:build         # Frontend

# Testes
npm run test:bdd               # BDD (Cucumber)
npm test                       # Unitários

# Lint
npm run lint --workspaces      # Todos
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
brew services start mongodb-community
# ou usar MongoDB Atlas na .env
```

### "Port 3000 in use"
```bash
# Mude no .env
PORT=3001
```

### "Frontend não carrega"
```bash
rm -rf packages/frontend/node_modules/.vite
npm install
npm run frontend:dev
```

## 📚 Documentação Disponível

- [FRONTEND.md](FRONTEND.md) — Guia do frontend
- [INICIALIZACAO.md](INICIALIZACAO.md) — Setup completo
- [ARQUITETURA.md](ARQUITETURA.md) — Design técnico
- [MONGODB.md](MONGODB.md) — Banco de dados
- [Agent/SKILL.md](Agent/SKILL.md) — Domínio
- [EXECUTIVO.md](EXECUTIVO.md) — Para PMs/CEOs

## 🎓 Próximos Passos

1. ✅ Criar algumas questões
2. ✅ Criar uma prova
3. 🔄 Próxima Sprint: **Geração de PDF**
4. 🔄 Sprint 3: **Motor de Correção**
5. 🔄 Sprint 4: **Relatórios**

## 💡 Dicas

- Use **Grid** ou **Lista** no topo de questões para mudar visualização
- Busque questões por enunciado em tempo real
- Prova exige **exatamente 5 questões** (não menos, não mais)
- Cada questão precisa de **5 alternativas**
- Toda questão precisa ter **pelo menos 1 resposta correta**

## 🚀 Pronto!

Sistema está 100% funcional. Abra o frontend, crie questões e provas, explore a interface!

**Qualquer dúvida, consulte [FRONTEND.md](FRONTEND.md) ou [INICIALIZACAO.md](INICIALIZACAO.md)**

---

**Última atualização**: 24 de março de 2026  
**Status**: ✅ Pronto para Uso
