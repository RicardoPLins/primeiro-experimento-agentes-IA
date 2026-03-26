# 🚀 Deploy no Vercel (Backend + Frontend)

## 📋 Pré-requisitos

1. **GitHub Repository** - Push seu código para GitHub
2. **MongoDB Atlas** - Crie um banco de dados em [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. **Vercel Account** - Crie uma conta em [https://vercel.com](https://vercel.com)

---

## 🔧 Passo 1: Configurar MongoDB Atlas

1. Vá para [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um novo projeto
3. Crie um cluster (opção gratuita está ok)
4. Na seção "Security", crie um usuário do banco de dados
5. Copie a string de conexão (ela vai parecer com): 
   ```
   mongodb+srv://usuario:senha@seu-cluster.mongodb.net/gerenciador-provas?retryWrites=true&w=majority
   ```

---

## 🎯 Passo 2: Deploy no Vercel

### Via CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Na raiz do projeto
vercel

# 4. Responder às perguntas:
# - Set up and deploy? → Yes
# - Which scope? → Seu usuário/organização
# - Link to existing project? → No
# - What's your project's name? → gerenciador-provas
# - In which directory is your code located? → ./
# - Want to modify these settings? → No
```

### Via Web (Alternativa)

1. Vá para [https://vercel.com/new](https://vercel.com/new)
2. Conecte sua conta GitHub
3. Selecione o repositório
4. Clique em "Deploy"

---

## 🌍 Passo 3: Configurar Variáveis de Ambiente

**Via CLI:**
```bash
vercel env add MONGODB_URI
# Cole: mongodb+srv://usuario:senha@seu-cluster.mongodb.net/gerenciador-provas

vercel env add NODE_ENV
# Cole: production

vercel env add VITE_API_URL
# Cole: https://seu-projeto.vercel.app

vercel env add FRONTEND_URL
# Cole: https://seu-projeto.vercel.app
```

**Ou pela Web:**

1. Vá para seu projeto no Vercel
2. Clique em "Settings"
3. Vá para "Environment Variables"
4. Adicione as variáveis:
   - `MONGODB_URI`: Sua string do Atlas
   - `NODE_ENV`: `production`
   - `VITE_API_URL`: `https://seu-projeto.vercel.app`
   - `FRONTEND_URL`: `https://seu-projeto.vercel.app`

---

## ✅ Passo 4: Testar o Deploy

Após 1-2 minutos, seu projeto estará em `https://seu-projeto.vercel.app`

### Testes rápidos:

```bash
# Health check do backend
curl https://seu-projeto.vercel.app/api/health

# Listar questões (se houver)
curl https://seu-projeto.vercel.app/api/questoes
```

---

## 🐛 Troubleshooting

### "Build failed"
- Verifique os logs no Vercel Dashboard
- Confirme que `vercel.json` está na raiz
- Verifique as dependências em `sistema/backend/package.json` e `sistema/frontend/package.json`

### "MongoDB connection error"
- Confirme que `MONGODB_URI` está correto
- Em MongoDB Atlas, adicione o IP `0.0.0.0/0` nas "Network Access"

### Frontend não carrega dados
- Verifique `VITE_API_URL` nas variáveis de ambiente
- Confirme CORS está habilitado (já está na configuração)

---

## 📝 Notas Importantes

- O Vercel auto-deploy a cada push para a branch principal
- Backend roda como **Serverless Functions** (sem servidor sempre ligado)
- Frontend é servido como **Static Site** (mais rápido)
- Primeira requisição pode demorar um pouco (cold start)

---

## 🔄 Redeploy

```bash
# Redeploy qualquer mudança
vercel --prod

# Ou simplesmente faça push para GitHub:
git push
```
