# MongoDB — Guia de Configuração e Boas Práticas

## Visão Geral

O Gerenciador de Provas usa **MongoDB 7+** como banco de dados primário, seguindo as melhores práticas definidas no SKILL.md.

## Configuração

### Variáveis de Ambiente

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/gerenciador-provas
MONGODB_DB_NAME=gerenciador-provas
MONGODB_POOL_MIN=5
MONGODB_POOL_MAX=10
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000
```

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `MONGODB_URI` | String de conexão MongoDB | `mongodb://localhost:27017/gerenciador-provas` |
| `MONGODB_DB_NAME` | Nome do banco de dados | `gerenciador-provas` |
| `MONGODB_POOL_MIN` | Mínimo de conexões no pool | `5` |
| `MONGODB_POOL_MAX` | Máximo de conexões no pool | `10` |
| `MONGODB_SERVER_SELECTION_TIMEOUT_MS` | Timeout seleção de servidor (ms) | `5000` |

## Coleções e Schemas

### 1. **questoes**

Armazena questões fechadas com alternativas.

```typescript
{
  _id: ObjectId,
  id: "uuid-v4",
  enunciado: "Qual é a capital do Brasil?",
  alternativas: [
    { id: "uuid", descricao: "Brasília", isCorreta: true },
    { id: "uuid", descricao: "São Paulo", isCorreta: false },
    ...
  ],
  createdAt: ISODate("2024-03-24T10:00:00.000Z"),
  updatedAt: ISODate("2024-03-24T10:00:00.000Z")
}
```

**Índices:**
- `id` (único)
- `createdAt`

### 2. **provas**

Armazena templates de prova (exames configurados).

```typescript
{
  _id: ObjectId,
  id: "uuid-v4",
  nome: "Prova de Matemática",
  disciplina: "Matemática",
  professor: "João Silva",
  data: ISODate("2024-04-01T00:00:00.000Z"),
  turma: "3º A",
  identificacao: "LETRAS",
  questoes: ["uuid-questao-1", "uuid-questao-2", ...],
  createdAt: ISODate("2024-03-24T10:00:00.000Z"),
  updatedAt: ISODate("2024-03-24T10:00:00.000Z")
}
```

**Índices:**
- `id` (único)
- `professor`
- `disciplina`

### 3. **provas_individuais**

Armazena instâncias concretas embaralhadas de uma prova.

```typescript
{
  _id: ObjectId,
  id: "uuid-v4",
  provaId: "uuid-prova",
  numero: 1,
  questoesEmbaralhadas: [
    {
      posicao: 0,
      questaoId: "uuid-questao",
      alternativasEmbaralhadas: ["uuid-alt-1", "uuid-alt-2", ...]
    },
    ...
  ],
  sementes: { 0: 123456, 1: 789012, ... },
  createdAt: ISODate("2024-03-24T10:00:00.000Z"),
  updatedAt: ISODate("2024-03-24T10:00:00.000Z")
}
```

**Índices:**
- `id` (único)
- `provaId`
- `(provaId, numero)` (composto, único) — Garante apenas uma prova por número

### 4. **gabaritos**

Armazena gabaritos de respostas.

```typescript
{
  _id: ObjectId,
  id: "uuid-v4",
  provaIndividualId: "uuid-prova-individual",
  numero: 1,
  respostas: ["AC", "B", "ABD", "E", "BC"],
  modo: "LETRAS",
  createdAt: ISODate("2024-03-24T10:00:00.000Z"),
  updatedAt: ISODate("2024-03-24T10:00:00.000Z")
}
```

**Índices:**
- `id` (único)
- `provaIndividualId`

### 5. **relatorios_notas**

Armazena notas dos alunos.

```typescript
{
  _id: ObjectId,
  id: "uuid-v4",
  email: "aluno@email.com",
  nome: "João Silva",
  cpf: "xxx.xxx.xxx-xx",
  notaFinal: 85.5,
  notas: [
    { questaoIndex: 0, nota: 1, peso: 1 },
    { questaoIndex: 1, nota: 0.5, peso: 1 },
    ...
  ],
  modoCorrecao: "MENOS_RIGOROSA",
  createdAt: ISODate("2024-03-24T10:00:00.000Z")
}
```

**Índices:**
- `id` (único)
- `email`
- `createdAt`

## Integridade Referencial

MongoDB não impõe Foreign Keys nativamente. A integridade é garantida na **camada de serviço**:

```typescript
// QuestaoService.excluir()
async excluir(id: string): Promise<void> {
  // Verificar se questão está vinculada a prova
  const estaVinculada = await provaRepository.questaoEstaVinculada(id);
  
  if (estaVinculada) {
    throw new ReferentialIntegrityError(
      `Questão está vinculada a uma ou mais provas`
    );
  }
  
  await questaoRepository.excluir(id);
}
```

## Transações

Para operações críticas envolvendo múltiplos documentos:

```typescript
// Exemplo: Gerar prova individual + gabarito atomicamente
const session = await mongoose.startSession();
session.startTransaction();

try {
  const provaIndividual = await provaIndividualRepository.criar(novaProva);
  const gabarito = await gabaritoRepository.criar(novoGabarito);
  
  await session.commitTransaction();
  return { provaIndividual, gabarito };
} catch (erro) {
  await session.abortTransaction();
  throw erro;
} finally {
  session.endSession();
}
```

## Segurança

### Nunca commititar credenciais

```bash
# ❌ ERRADO
MONGODB_URI=mongodb+srv://admin:password123@cluster.mongodb.net/db

# ✅ CORRETO (.env local, não commititar)
MONGODB_URI=mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster.mongodb.net/db
```

### Não expor dados sensíveis em logs

```typescript
// ❌ ERRADO
console.log('Resposta:', resposta.cpf); // Expõe CPF do aluno

// ✅ CORRETO
console.log('Resposta registrada:', { id: resposta.id });
```

### Mascarar CPF na resposta HTTP

```typescript
// No controller
const resposta = await service.obterResposta(id);
return {
  ...resposta,
  cpf: resposta.cpf ? resposta.cpf.substring(0, 3) + '.***.***-**' : undefined
};
```

## Performance — Indexação

### Índices recomendados por domínio

**Questões:**
```javascript
db.questoes.createIndex({ "id": 1 }, { unique: true });
db.questoes.createIndex({ "createdAt": 1 });
```

**Provas:**
```javascript
db.provas.createIndex({ "id": 1 }, { unique: true });
db.provas.createIndex({ "professor": 1 });
db.provas.createIndex({ "disciplina": 1 });
```

**Provas Individuais:**
```javascript
db.provas_individuais.createIndex({ "id": 1 }, { unique: true });
db.provas_individuais.createIndex({ "provaId": 1 });
db.provas_individuais.createIndex({ "provaId": 1, "numero": 1 }, { unique: true });
```

**Relatórios:**
```javascript
db.relatorios_notas.createIndex({ "id": 1 }, { unique: true });
db.relatorios_notas.createIndex({ "email": 1 });
db.relatorios_notas.createIndex({ "createdAt": -1 });
```

## Backups

### Backup manual

```bash
# Export para arquivo BSON
mongodump --uri="mongodb://localhost:27017/gerenciador-provas" \
  --out=./backups/$(date +%Y%m%d_%H%M%S)
```

### Restore

```bash
mongorestore --uri="mongodb://localhost:27017/gerenciador-provas" \
  ./backups/20240324_100000
```

## Monitoramento

### Verificar conexão

```bash
# No node
const connection = mongoConnection.isConnected();
console.log(connection); // true/false
```

### Listar coleções

```bash
mongo gerenciador-provas
> show collections
```

### Verificar documentos

```bash
mongo gerenciador-provas
> db.questoes.find().limit(1)
> db.provas.countDocuments()
```

## Troubleshooting

### Erro: "E11000 duplicate key error"

Significa que um valor único foi duplicado. Verificar:

1. Se realmente precisa ser único
2. Se há dados antigos com mesmo valor

```bash
# Verificar índices
db.questoes.getIndexes()

# Remover índice se necessário
db.questoes.dropIndex("id_1")
```

### Erro: "exceeding maximum connection pool size"

Aumentar `MONGODB_POOL_MAX` no `.env`:

```bash
MONGODB_POOL_MAX=20
```

### Coleções vazias ou dados desapareceram

Pode ser que esteja conectando a banco diferente. Verificar `MONGODB_DB_NAME`.

---

**Última atualização**: 24 de março de 2026
