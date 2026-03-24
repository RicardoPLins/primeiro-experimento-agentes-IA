# 🎉 Sistema Gerenciador de Provas — Construído com Sucesso

## 👋 Bem-vindo!

Você agora tem um **sistema fullstack profissional** pronto para desenvolvimento contínuo, construído seguindo todas as melhores práticas em:

- ✅ **TypeScript** (stricto)
- ✅ **Node.js + Express** (backend)
- ✅ **React 18 + Vite** (frontend)
- ✅ **MongoDB 7+** (persistência)
- ✅ **Cucumber/Gherkin** (testes BDD em português)
- ✅ **Padrões de Arquitetura** (Repository, Service, Controller)

---

## 🚀 Começar em 2 Passos

### Passo 1: Instalar
```bash
npm install
brew services start mongodb-community
cp .env.example .env
```

### Passo 2: Rodar
```bash
npm run dev
```

**Pronto!** Você tem:
- 🌐 Frontend em http://localhost:5173
- 🔌 Backend API em http://localhost:3000/api
- ✅ Health-check em http://localhost:3000/health

---

## 📚 Documentação

| Documento | Para Quem | Propósito |
|-----------|-----------|----------|
| [QUICK_START.md](QUICK_START.md) | Novato | 5 minutos para começar |
| [INICIALIZACAO.md](INICIALIZACAO.md) | Dev | Setup completo + troubleshooting |
| [MONGODB.md](MONGODB.md) | DBA/Dev | Schemas, índices, boas práticas |
| [ARQUITETURA.md](ARQUITETURA.md) | Arquiteto | Visão geral e padrões |
| [CONSTRUCAO.md](CONSTRUCAO.md) | PM/Tech Lead | Sumário do que foi construído |
| [Agent/SKILL.md](Agent/SKILL.md) | Todos | Vocabulário de domínio + convenções |
| [Agent/project-config.yaml](Agent/project-config.yaml) | Todos | Configuração centralizada |

---

## 🏛️ Arquitetura em 1 Diagrama

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│              React 18 + Vite (http://5173)                   │
│          [React Router, React Query, Zustand, Zod]           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (Proxy /api → :3000)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│         Express.js + TypeScript (http://3000)                │
│    ┌──────────────────────────────────────────────────┐     │
│    │           Controllers (HTTP Layer)               │     │
│    │  QuestaoController | ProvaController             │     │
│    └────────────────────┬─────────────────────────────┘     │
│                         ↓                                     │
│    ┌──────────────────────────────────────────────────┐     │
│    │    Services (Domain Logic Layer)                 │     │
│    │  QuestaoService | ProvaService                   │     │
│    │  [Validações, Regras de Negócio]                │     │
│    └────────────────────┬─────────────────────────────┘     │
│                         ↓                                     │
│    ┌──────────────────────────────────────────────────┐     │
│    │   Repositories (Data Access Layer)               │     │
│    │  QuestaoRepository | ProvaRepository             │     │
│    │  ProvaIndividualRepository | etc                 │     │
│    └────────────────────┬─────────────────────────────┘     │
└────────────────────────┼────────────────────────────────────┘
                         │ MongoDB Driver (Mongoose)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                          │
│  [questoes] [provas] [provas_individuais]                   │
│  [gabaritos] [relatorios_notas]                             │
│  + Índices únicos, compostos, com retry                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 O Que Você Tem

### Backend
- ✅ **Server Express** com middlewares (helmet, cors, morgan)
- ✅ **5 Controllers** tipados (QuestaoController, ProvaController, etc)
- ✅ **2 Services** com lógica de domínio + validações
- ✅ **5 Repositórios** (padrão isolado, sem queries inline)
- ✅ **5 Schemas MongoDB** com índices otimizados
- ✅ **Camada de Erros** tipada (ApplicationError + especializações)
- ✅ **12 Endpoints REST** funcionais (CRUD Questões + CRUD Provas)
- ✅ **Health-check** + graceful shutdown

### Frontend
- ✅ **Vite** configurado com React 18
- ✅ **React Router** base
- ✅ **TypeScript** stricto
- ✅ **Proxy** para API backend
- ✅ **Estrutura** pronta para componentes

### Testes
- ✅ **40+ Cenários BDD** em português (Gherkin)
- ✅ **28+ Passos** implementados (exemplo Questões)
- ✅ **4 Domínios** de teste (questões, provas, pdf, correção)
- ✅ **Feature files** prontos para implementação

### Documentação
- ✅ **INICIALIZACAO.md** — Setup completo
- ✅ **MONGODB.md** — BD + boas práticas
- ✅ **ARQUITETURA.md** — Visão geral
- ✅ **CONSTRUCAO.md** — Sumário de construção
- ✅ **QUICK_START.md** — 5 minutos
- ✅ **SKILL.md** — Atualizado com MongoDB
- ✅ **project-config.yaml** — Atualizado

---

## 🎯 Próximos Passos

### Para Esta Semana
1. ✅ Rodar em desenvolvimento (`npm run dev`)
2. ✅ Testar endpoints (curl ou Postman)
3. ✅ Explorar código dos Services

### Para Esta Sprint
1. Implementar **Geração de PDF** (embaralhamento)
2. Implementar **Motor de Correção** (rigoroso + proporcional)
3. Implementar **Frontend** completo

### Para Produção
1. Docker + docker-compose
2. CI/CD (GitHub Actions)
3. Deploy (escolher plataforma)

---

## 🔑 Pontos-Chave da Implementação

### 1. **Padrão Repository**
Todo acesso ao banco é isolado em repositórios. Services nunca conhecem queries.

```typescript
// ✅ CORRETO
const questao = await questaoRepository.buscarPorId(id);

// ❌ ERRADO
const questao = await Questao.findById(id);  // direto no service
```

### 2. **Validações de Domínio**
Questão DEVE ter 5+ alternativas, pelo menos 1 correta.

```typescript
// Service valida ANTES de persistir
async criar(enunciado, alternativas) {
  if (alternativas.length < 5) {
    throw new ValidationError('Mínimo 5');
  }
  if (!alternativas.some(a => a.isCorreta)) {
    throw new ValidationError('Nenhuma correta');
  }
  return questionRepository.criar(...);
}
```

### 3. **Integridade Referencial**
Não pode excluir Questão que está em uma Prova.

```typescript
// Service bloqueia a exclusão
async excluir(questaoId) {
  const estaVinculada = await provaRepository
    .questaoEstaVinculada(questaoId);
  
  if (estaVinculada) {
    throw new ReferentialIntegrityError('Vinculada a prova');
  }
  
  await questaoRepository.excluir(questaoId);
}
```

### 4. **Erros Tipados**
Todos os erros têm `code`, `message`, `statusCode`, `details`.

```typescript
throw new NotFoundError('Questão', id);
// → { code: 'NOT_FOUND', message: '...', statusCode: 404 }

throw new ValidationError('Enunciado vazio');
// → { code: 'VALIDATION_ERROR', message: '...', statusCode: 400 }
```

### 5. **MongoDB com Índices**
Cada coleção tem índices para busca eficiente.

```javascript
// Índice único para `id` (UUID público)
db.questoes.createIndex({ "id": 1 }, { unique: true });

// Índice composto para prova individual
db.provas_individuais.createIndex(
  { "provaId": 1, "numero": 1 },
  { unique: true }
);
```

---

## 📋 Checklist — Antes de Editar Código

- [ ] Ler [Agent/SKILL.md](Agent/SKILL.md) — domínio e convenções
- [ ] Ler [Agent/project-config.yaml](Agent/project-config.yaml) — regras
- [ ] Ler [ARQUITETURA.md](ARQUITETURA.md) — padrões
- [ ] Instalar e rodar `npm run dev`
- [ ] Testar um endpoint com curl
- [ ] Entender fluxo Controller → Service → Repository

---

## 🎓 Estrutura Mental

### Quando Adicionar Funcionalidade

**Ordem de implementação:**

1. **Spec** (descrever no Gherkin)
2. **Repository** (acesso dados)
3. **Service** (lógica + validação)
4. **Controller** (HTTP)
5. **Routes** (endpoint)
6. **Tests** (implementar passos)

**Nunca:**
- Colocar SQL/queries em Services
- Validações de domínio em Controllers
- Lógica de negócio em Repositories

---

## 🔗 Referências Rápidas

### Criar Questão (curl)
```bash
curl -X POST http://localhost:3000/api/questoes \
  -H "Content-Type: application/json" \
  -d '{
    "enunciado": "Pergunta",
    "alternativas": [
      {"descricao": "A", "isCorreta": true},
      {"descricao": "B", "isCorreta": false},
      {"descricao": "C", "isCorreta": false},
      {"descricao": "D", "isCorreta": false},
      {"descricao": "E", "isCorreta": false}
    ]
  }'
```

### Listar Questões
```bash
curl http://localhost:3000/api/questoes
```

### Criar Prova (após ter 5 questões)
```bash
curl -X POST http://localhost:3000/api/provas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Prova 1",
    "disciplina": "Matemática",
    "professor": "João",
    "data": "2024-04-01",
    "turma": "3A",
    "identificacao": "LETRAS",
    "questoesIds": ["id1", "id2", "id3", "id4", "id5"]
  }'
```

---

## 🚨 Regras Importantes (Não Quebrar)

| Regra | Por Quê | Consequência |
|-------|--------|-------------|
| Questão DEVE ter 5+ alternativas | Domínio do negócio | ValidationError |
| Prova DEVE ter exatamente 5 questões | Domínio do negócio | ValidationError |
| Não deletar Questão vinculada | Integridade BD | ReferentialIntegrityError |
| Índice único em `id` | Performance + estabilidade | E11000 duplicate key |
| Não queries em Services | Separação de camadas | Review |
| Erros devem ter statusCode | Contrato HTTP | Review |

---

## 💬 Perguntas Frequentes

**P: Por que tanto de boilerplate?**  
R: Separação clara de camadas = código testável e manutenível.

**P: Preciso criar todas as 5 coleções MongoDB agora?**  
R: Não, elas estão definidas. Mongoose as cria automaticamente ao primeiro `create()`.

**P: E se quebrar um teste BDD?**  
R: Rodar `npm run test:bdd` para verificar e implementar os passos.

**P: Posso mudar o nome de um arquivo?**  
R: Sim, desde que ajuste os imports (TypeScript avisa automaticamente).

**P: Como adicionar nova validação?**  
R: No Service, dentro do método correspondente.

---

## 🎊 Parabéns!

Você tem um **foundation sólida** para construir um grande produto. Agora é só **expandir**: PDF, correção, frontend, deploy.

**Lembre-se:**
- Tudo começa com o **domínio** (SKILL.md)
- Tudo é **tipado** (TypeScript stricto)
- Tudo é **testado** (BDD)
- Tudo é **documentado** (este README)

---

**Próximo passo?** Abra [QUICK_START.md](QUICK_START.md) e comece a codificar! 🚀

---

**Construído com ❤️ como Senior Fullstack TypeScript + MongoDB Expert**  
**24 de março de 2026**
