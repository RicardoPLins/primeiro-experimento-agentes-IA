# 🎨 Guia de Uso do Frontend

## Estrutura Completa

O frontend agora possui:

### ✅ Componentes Implementados

1. **FormQuestao** — Criar/editar questões com validação
   - Mínimo 10 caracteres no enunciado
   - Obrigatório 5 alternativas
   - Validação de alternativa correta

2. **FormProva** — Criar/editar provas
   - Seleção exata de 5 questões
   - Configuração de identificação (LETRAS ou POTÊNCIAS_DE_2)
   - Dados de professor, turma, disciplina

3. **QuestaoCard** — Visualizar questão
   - Exibe enunciado, alternativas, respostas corretas
   - Modos: selecionável, deletável, editável
   - Suporta view em grid ou lista

4. **Sidebar** — Navegação
   - Links para Questões, Provas, PDF, Correção, Relatório
   - Design dark/profissional

5. **Toast** — Notificações
   - Mensagens de sucesso/erro
   - Desaparece automaticamente em 3s

### ✅ Páginas Implementadas

- **Dashboard** — Início com status geral
- **ListaQuestoes** — Grid/lista com busca e filtro
- **CriarEditarQuestao** — Formulário
- **ListaProvas** — Grid com cards informativos
- **CriarEditarProva** — Formulário com seleção de 5 questões
- **VisualizarProva** — Detalhes completos da prova
- **ProvaIndividualPage** — Placeholder para próximos passos

### ✅ Hooks Customizados

```typescript
// useQuestoes.ts
useQuestoes()              // GET todas questões
useQuestao(id)             // GET uma questão
useCriarQuestao()          // POST questão
useAtualizarQuestao(id)    // PUT questão
useDeletarQuestao()        // DELETE questão

// useProvas.ts
useProvas()                // GET todas provas
useProva(id)               // GET uma prova
useCriarProva()            // POST prova
useAtualizarProva(id)      // PUT prova
useDeletarProva()          // DELETE prova
```

### ✅ Store com Zustand

```typescript
// useUiStore.ts
sidebarOpen: boolean
toast: { message, type }
showToast(message, type)   // 'success' | 'error' | 'info'
hideToast()
```

## Como Usar

### 1. Criar Questão

```
Sidebar → ❓ Questões → ➕ Nova Questão
  ↓
Preencher enunciado
Preencher 5 alternativas
Marcar resposta correta
Clicar "Salvar Questão"
```

### 2. Criar Prova

```
Sidebar → 📄 Provas → ➕ Nova Prova
  ↓
Preencher nome, disciplina, professor, turma, data
Selecionar EXATAMENTE 5 questões
Escolher identificação (LETRAS ou POTÊNCIAS_DE_2)
Clicar "Salvar Prova"
```

### 3. Visualizar Prova

```
Sidebar → 📄 Provas
  ↓
Clique em um card → 👁️ Visualizar
  ↓
Vê todas as questões com gabarito
```

### 4. Editar

- Questão: Lista → ✏️ Editar
- Prova: Visualizar → ✏️ Editar

### 5. Deletar

- Questão: Lista → 🗑️ Deletar
- Prova: Grid → 🗑️ Deletar

## Stack Utilizado

- **React 18** — UI
- **TypeScript** — Type-safe
- **React Router v6** — Navegação
- **React Query** — Data fetching & caching
- **React Hook Form** — Formulários
- **Zod** — Validação de schema
- **Zustand** — State management
- **Tailwind CSS** — Styling
- **Vite** — Build rápido

## Arquitetura

```
App.tsx (Routes)
  ├─ Sidebar (Navigation)
  ├─ Main (Route Content)
  │  ├─ Pages (páginas completas)
  │  │  ├─ Dashboard
  │  │  ├─ ListaQuestoes
  │  │  ├─ CriarEditarQuestao
  │  │  ├─ ListaProvas
  │  │  ├─ CriarEditarProva
  │  │  ├─ VisualizarProva
  │  │  └─ ProvaIndividualPage
  │  └─ Componentes reutilizáveis
  │     ├─ FormQuestao
  │     ├─ FormProva
  │     ├─ QuestaoCard
  │     ├─ Toast
  │     └─ Sidebar
  ├─ Hooks (API)
  │  ├─ useQuestoes
  │  └─ useProvas
  ├─ Store
  │  └─ useUiStore
  └─ Toast (notificações)
```

## Fluxo de Dados

```
Componente
  ↓
Hook (useQuestoes, useProvas)
  ↓
React Query (caching + retry)
  ↓
API (localhost:3000)
  ↓
Backend (Express + Services)
  ↓
MongoDB
```

## Próximos Passos

1. **PDF Generator** — Embaralhar questões e gerar PDF
2. **Correction Engine** — Importar CSV com respostas e gerar notas
3. **Relatórios** — Análise de desempenho dos alunos
4. **UI Polish** — Melhorar design, adicionar animações
5. **Tests** — Testes unitários e E2E

## Comandos Úteis

```bash
# Dev
npm run frontend:dev

# Build
npm run build

# Lint
npm --workspace=@gerenciador-provas/frontend run lint

# Type check
npm --workspace=@gerenciador-provas/frontend run tsc --noEmit
```

## Troubleshooting

### Frontend não carrega

```bash
# Limpar cache
rm -rf packages/frontend/node_modules/.vite

# Reinstalar
npm install
```

### API não responde

```bash
# Verificar backend
curl http://localhost:3000/health

# Verificar logs
tail -f /tmp/backend.log
```

### Proxy não funciona

Verificar `packages/frontend/vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

---

**Última atualização**: 24 de março de 2026  
**Frontend Status**: ✅ Produção-ready
