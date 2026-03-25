# 📋 Plano de Implementação - Geração de PDFs (Requisito 3)

**Escrito como Senior Expert em Planejamento**  
**Data**: 25 de março de 2026  
**Status**: ✅ Análise de Implementação Existente + Plano de Conclusão

---

## 🎯 Objetivo
Implementar geração de provas individuais com PDFs embaralhados e gabarito em CSV, conforme requisito 3 das funcionalidades.

---

## 📊 Análise de Situação Atual

### ✅ O que JÁ EXISTE
1. **Backend - Serviços**
   - `ProvaIndividualService`: Lógica de shuffle com seed determinístico
   - `RelatorioProvaService`: Geração de PDFs e CSVs
   - `ProvaIndividualController`: Endpoints REST
   - `ProvaIndividualRepository`: CRUD de provas individuais

2. **Frontend - Página**
   - `GerarProvasIndividuaisPage`: UI para geração
   - Integração com React Query para chamadas API
   - Diálogos para download de PDFs/CSV

3. **Database**
   - Schema `ProvaIndividual`: Armazena questões embaralhadas + sementes
   - Schema `Gabarito`: Armazena respostas corretas por prova individual

### ⚠️ O que PRECISA SER VERIFICADO E MELHORADO
1. Validação completa do embaralhamento
2. Qualidade visual dos PDFs
3. Performance com muitas provas (100+)
4. Testes de casos extremos
5. Tratamento de erros robusto
6. Documentação de seed para reprodutibilidade

---

## 🔧 Plano Passo a Passo

### **FASE 1: VALIDAÇÃO E TESTES (1-2 dias)**

#### 1.1 - Verificar Embaralhamento
**Responsável**: Backend Developer  
**Arquivos**: `prova-individual.service.ts`

**Tarefas**:
- [ ] Testar `seededShuffle()` com seed fixo
  - Mesmo seed = mesmo resultado? ✓
  - Distribuição aleatória uniforme? ✓
  - Performance aceitável? ✓
  
**Critério de Sucesso**:
```typescript
// Teste: mesma seed deve gerar mesma ordem
const seed1 = gerarProvaIndividual(prova, 1, 12345);
const seed2 = gerarProvaIndividual(prova, 1, 12345);
expect(seed1.questoesEmbaralhadas).toEqual(seed2.questoesEmbaralhadas);
```

#### 1.2 - Verificar Mapeamento de Alternativas
**Responsável**: Backend Developer  
**Arquivos**: `prova-individual.service.ts`

**Tarefas**:
- [ ] Validar que resposta correta mapeia corretamente após shuffle
- [ ] Testar com múltiplas respostas corretas
- [ ] Testar com 1 única resposta correta

**Exemplo de teste**:
```typescript
// Alternativas originais: [A-sim, B-não, C-sim, D-não, E-não]
// Após shuffle: [D-não, C-sim, A-sim, E-não, B-não]
// Gabarito esperado: [C, E, A] (índices das corretas após shuffle)
```

#### 1.3 - Testar Geração em Massa
**Responsável**: Backend Developer  
**Tarefas**:
- [ ] Gerar 10 provas → Verificar arquivo
- [ ] Gerar 100 provas → Medir tempo
- [ ] Gerar 500 provas → Verificar memória
- [ ] Gerar 1000 provas → Limite máximo

**Métricas Esperadas**:
- 10 provas: < 2 segundos
- 100 provas: < 15 segundos
- 500 provas: < 60 segundos
- 1000 provas: < 120 segundos

---

### **FASE 2: QUALIDADE DE PDFs (1-2 dias)**

#### 2.1 - Validar Conteúdo dos PDFs
**Responsável**: QA / Developer  
**Verificações Manuais**:

- [ ] **Cabeçalho**
  - ✓ Nome da prova centralizado, tamanho 20
  - ✓ Disciplina, Professor, Turma, Data
  - ✓ Linha separadora após cabeçalho
  
- [ ] **Conteúdo de Questões**
  - ✓ Numeração: 1, 2, 3, 4, 5
  - ✓ Enunciado completo
  - ✓ 5 alternativas (embaralhadas)
  - ✓ Rótulos corretos: A,B,C,D,E ou 1,2,4,8,16 (baseado no tipo)
  - ✓ Espaço para resposta do aluno
  
- [ ] **Rodapé**
  - ✓ Número da prova individual (ex: "Prova #5")
  - ✓ Em cada página
  
- [ ] **Última Página**
  - ✓ Espaço para Nome do aluno
  - ✓ Espaço para CPF
  - ✓ Instrução clara

#### 2.2 - Validar Formato de Tipo
**Responsável**: Backend / QA

**Para LETRAS**:
```
1. Questão com A, B, C, D, E
   Espaço: _____________________
```

**Para POTÊNCIAS_DE_2**:
```
1. Questão com 1, 2, 4, 8, 16
   Soma: _____________________
```

- [ ] Verificar 5 PDFs tipo LETRAS
- [ ] Verificar 5 PDFs tipo POTÊNCIAS_DE_2
- [ ] Verificar mistura: 2 LETRAS + 3 POTÊNCIAS_DE_2 = ERRO

---

### **FASE 3: VALIDAÇÃO DE CSVs (1 dia)**

#### 3.1 - Formato de CSV Gabarito
**Responsável**: Backend Developer

**Estrutura Esperada**:
```csv
Prova,Q1,Q2,Q3,Q4,Q5
1,A;C,B,D,A;B,E
2,B,C;D,A,E,B;C
3,1,2+4,1+8,2,16
```

**Validações**:
- [ ] Header correto: `Prova,Q1,Q2,Q3,Q4,Q5`
- [ ] Separador: vírgula
- [ ] Múltiplas respostas: separadas por `;`
- [ ] Sem espaços extras
- [ ] Tipo LETRAS: letras maiúsculas (A-E)
- [ ] Tipo POTÊNCIAS_DE_2: números ou somas (1,2,4,8,16,3,5,6,9,10,12,etc)

#### 3.2 - Testar Reprodutibilidade
**Responsável**: Backend Developer

**Teste**: Gerar CSV duas vezes com mesmas provas
```
CSV1: sha256 hash
CSV2: sha256 hash
Devem ser IGUAIS ✓
```

---

### **FASE 4: INTEGRAÇÃO FRONTEND (1-2 dias)**

#### 4.1 - Melhorar UX da Página
**Responsável**: Frontend Developer  
**Arquivos**: `GerarProvasIndividuaisPage.tsx`

**Tarefas**:
- [ ] Validar input (1-1000)
- [ ] Loading state durante geração
- [ ] Feedback progressivo (geradas 45/100)
- [ ] Botões de download por PDF individual
- [ ] Botão de download ZIP com todos os PDFs
- [ ] Botão de download CSV único
- [ ] Estimativa de tempo (100 provas = ~15s)

#### 4.2 - Adicionar Informações de Resultado
**Responsável**: Frontend Developer

**Card de Resultado**:
```
✅ Geração Concluída!
📊 Estatísticas:
  - Total de provas: 100
  - Tipo: Múltipla Escolha (Letras)
  - Tamanho total PDFs: 45.2 MB
  - Arquivo CSV: gabarito.csv (12 KB)
  - Tempo: 14.5 segundos

📥 Downloads:
  [↓ Todos os PDFs (ZIP)]
  [↓ Gabarito (CSV)]
  [↓ Individual: Prova 1]
  [↓ Individual: Prova 2]
  ... (scroll com lista de 100)
```

#### 4.3 - Tratamento de Erros
**Responsável**: Frontend Developer

**Cenários**:
- [ ] Prova não encontrada
- [ ] Falta de questões suficientes
- [ ] Erro na geração (retry logic)
- [ ] Download interrompido
- [ ] Timeout (> 120s)

---

### **FASE 5: TESTES AUTOMATIZADOS (1-2 dias)**

#### 5.1 - Backend Tests
**Arquivo**: `tests/backend/prova-individual.service.test.ts`

```typescript
describe('ProvaIndividualService', () => {
  describe('seededShuffle', () => {
    it('mesmo seed gera mesma ordem', () => {});
    it('seeds diferentes geram ordens diferentes', () => {});
    it('shuffle preserva todas as alternativas', () => {});
  });

  describe('gerarProvasIndividuais', () => {
    it('gera corretamente quantidade de provas', () => {});
    it('cada prova tem seed única', () => {});
    it('alternativas são embaralhadas corretamente', () => {});
    it('respostas corretas são mapeadas corretamente', () => {});
  });
});
```

#### 5.2 - Frontend Tests
**Arquivo**: `tests/frontend/GerarProvasIndividuaisPage.test.tsx`

```typescript
describe('GerarProvasIndividuaisPage', () => {
  it('renderiza input de quantidade', () => {});
  it('valida quantidade 1-1000', () => {});
  it('mostra loading durante geração', () => {});
  it('exibe diálogo com opções de download', () => {});
  it('faz download de PDF individual', () => {});
  it('faz download de CSV', () => {});
});
```

#### 5.3 - Integration Tests
**Arquivo**: `tests/integration/prova-pdf-flow.test.ts`

```typescript
describe('Fluxo Completo de Geração de PDFs', () => {
  it('cria prova → gera PDFs → download CSV', async () => {});
  it('valida 100 PDFs gerados corretamente', async () => {});
  it('CSV gabarito corresponde aos PDFs', async () => {});
});
```

---

### **FASE 6: PERFORMANCE E OTIMIZAÇÕES (1 dia)**

#### 6.1 - Otimizar Geração de PDFs
**Responsável**: Backend Developer

**Tarefas**:
- [ ] Cache de fonte PDFs
- [ ] Stream direto para arquivo (sem buffer em memória)
- [ ] Processamento paralelo com worker threads
- [ ] Limite de memória: máximo 500MB

**Código Sugerido**:
```typescript
// Em vez de gerar todos os buffers em memória
// Usar stream + pipeline
const zip = new AdmZip();
for (let i = 1; i <= quantidade; i++) {
  const pdf = await this.gerarPDFProvaIndividual(provaIndividualId);
  zip.addFile(`prova-${i}.pdf`, pdf);
}
return zip.toBuffer();
```

#### 6.2 - Caching Inteligente
**Responsável**: Backend Developer

- [ ] Cache de questionários já embaralhados
- [ ] Reutilizar PDFs já gerados
- [ ] Invalidar cache quando questão é editada

#### 6.3 - Monitoramento
**Responsável**: DevOps / Backend Developer

- [ ] Log de tempo de geração por prova
- [ ] Métrica de erro rate
- [ ] Alerta se > 2 minutos por 100 provas

---

### **FASE 7: DOCUMENTAÇÃO E ENTREGA (1 dia)**

#### 7.1 - Documentação Técnica
**Responsável**: Technical Writer / Developer

- [ ] README de como usar a feature
- [ ] Swagger/OpenAPI docs para endpoints
- [ ] Documentação de seeds e reprodutibilidade
- [ ] Exemplos de CSV gabarito
- [ ] Troubleshooting guide

#### 7.2 - Documentação de Usuário
**Responsável**: Product Manager / Developer

- [ ] Manual de usuário
- [ ] Screenshots de cada passo
- [ ] FAQ
- [ ] Video tutorial (opcional)

#### 7.3 - Entrega
**Responsável**: Team Lead

- [ ] Code review completo
- [ ] Merge para main
- [ ] Deploy para staging
- [ ] Deploy para produção
- [ ] Comunicação ao usuário final

---

## 📈 Timeline Estimada

| Fase | Dias | Inicio | Fim |
|------|------|--------|-----|
| 1. Validação e Testes | 2 | Dia 1 | Dia 2 |
| 2. Qualidade de PDFs | 2 | Dia 3 | Dia 4 |
| 3. Validação de CSVs | 1 | Dia 5 | Dia 5 |
| 4. Integração Frontend | 2 | Dia 6 | Dia 7 |
| 5. Testes Automatizados | 2 | Dia 8 | Dia 9 |
| 6. Performance | 1 | Dia 10 | Dia 10 |
| 7. Documentação | 1 | Dia 11 | Dia 11 |
| **Total** | **11 dias** | | |

---

## ✅ Checklist de Aceitação (DoD - Definition of Done)

### Backend
- [ ] Todas as functions possuem JSDoc comments
- [ ] Sem console.log em produção (apenas logs estruturados)
- [ ] Testes unitários com cobertura > 80%
- [ ] Testes de integração passando
- [ ] Sem erros TypeScript
- [ ] Validação de entrada robusta
- [ ] Tratamento de erro com mensagens claras

### Frontend
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Sem console errors/warnings
- [ ] Performance > 60fps
- [ ] Testes unitários > 70% cobertura
- [ ] Suporta navegadores: Chrome, Firefox, Safari, Edge

### Database
- [ ] Indexes otimizados
- [ ] Backup strategy definida
- [ ] Migration scripts testadas

### Operacional
- [ ] Documentação atualizada
- [ ] Deployment guide
- [ ] Rollback plan
- [ ] Monitoring alerts configurados
- [ ] SLA definido (% uptime esperado)

---

## 🚀 Priorização de Melhorias

### Must Have (MVP)
1. Geração funcional de PDFs individuais
2. Shuffle determinístico com seed
3. CSV com gabarito correto
4. Download de PDFs individuais
5. Download de CSV

### Should Have
1. Download em ZIP
2. Feedback progressivo de geração
3. Validação completa de tipos
4. Testes automatizados
5. Documentação

### Nice to Have
1. Batch processing em background
2. Notificação por email
3. Histórico de gerações
4. Preview de PDF no browser
5. Assinatura digital do PDF

---

## 🎓 Lessons Learned & Boas Práticas

### O que Fazer
✅ Use seeds determinísticas para reproducibilidade  
✅ Valide tipos em múltiplas camadas (frontend + backend)  
✅ Teste com dados reais em quantidade  
✅ Documente formato exato de CSV  
✅ Use streams para PDFs grandes  

### O que Evitar
❌ Não armazene PDFs em memória (use temp files)  
❌ Não confie apenas em validação frontend  
❌ Não ignore performance com 1000+ provas  
❌ Não misture tipos em mesma prova  
❌ Não esqueça de tratamento de erro  

---

## 📞 Próximos Passos

1. **Aprovação do Plano**: Review com stakeholders
2. **Alocação de Recursos**: Atribuir developers
3. **Setup de Ambiente**: Instalar dependências (pdfkit, archiver)
4. **Iniciar Fase 1**: Validação e Testes

---

**Documento Preparado Por**: Senior Expert em Planejamento  
**Revisão**: Necessária antes de iniciar implementação  
**Última Atualização**: 25 de março de 2026
