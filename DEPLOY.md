# 🚀 Guia de Deploy no Vercel - Unilever Quiz Platform

## 📋 Pré-requisitos

1. Conta no Vercel (https://vercel.com)
2. Git instalado
3. Repositório no GitHub (recomendado)

## 🔧 Preparação (JÁ FEITO ✅)

- ✅ `vercel.json` criado
- ✅ Script `vercel-build` adicionado ao package.json
- ✅ Terminologia atualizada de "Funcionário" para "Colaborador"

## 🌐 Opção 1: Deploy via Interface Web do Vercel (MAIS FÁCIL)

### Passo 1: Criar Repositório no GitHub

```bash
# No terminal, dentro da pasta unilever/frontend
git init
git add .
git commit -m "🎉 Initial commit - Unilever Quiz Platform"
```

Depois, crie um repositório no GitHub e faça o push:
```bash
git remote add origin https://github.com/SEU-USUARIO/unilever-quiz.git
git branch -M main
git push -u origin main
```

### Passo 2: Importar no Vercel

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Conecte sua conta do GitHub
4. Selecione o repositório `unilever-quiz`
5. Configure:
   - **Framework Preset**: Angular
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist/frontend/browser`

6. Clique em "Deploy"

### Passo 3: Configurar Variáveis de Ambiente (se necessário)

No dashboard do Vercel:
1. Vá em "Settings" > "Environment Variables"
2. Adicione as variáveis necessárias

## 🖥️ Opção 2: Deploy via CLI do Vercel

### Instalar Vercel CLI

```bash
npm install -g vercel
```

### Deploy

```bash
cd frontend
vercel login
vercel
```

Siga as instruções na tela:
- Setup and deploy? **Y**
- Which scope? **Sua conta**
- Link to existing project? **N**
- Project name? **unilever-quiz**
- In which directory? **./  (current directory)**
- Want to override settings? **N**

## 🔗 Backend (NestJS)

⚠️ **IMPORTANTE**: O backend precisa ser deployado separadamente.

### Opções para o Backend:

1. **Railway** (https://railway.app)
   - Suporta Node.js/NestJS nativamente
   - Banco de dados SQLite (ou migrar para PostgreSQL)

2. **Render** (https://render.com)
   - Free tier disponível
   - Deploy automático via GitHub

3. **Heroku**
   - Tradicional e confiável

### Após Deploy do Backend:

1. Anote a URL do backend (ex: `https://seu-backend.railway.app`)
2. No Vercel, adicione variável de ambiente:
   - Nome: `API_URL`
   - Valor: URL do seu backend
   
3. Atualize os serviços do frontend para usar `environment.apiUrl` em vez de `localhost:3000`

## 📝 Checklist Final

- [ ] Frontend deployado no Vercel
- [ ] Backend deployado (Railway/Render/Heroku)
- [ ] Variável de ambiente API_URL configurada no Vercel
- [ ] Banco de dados configurado no backend
- [ ] Teste de login funcionando
- [ ] Criação de quiz funcionando
- [ ] Dashboard de colaboradores funcionando

## 🎯 URLs de Acesso

Após o deploy, você receberá URLs como:
- Frontend: `https://unilever-quiz.vercel.app`
- Backend: `https://seu-backend.railway.app`

## 🔐 Credenciais de Teste

- **Admin**: admin@unilever.com / admin123
- **Colaborador**: user@unilever.com / admin123

## 🐛 Troubleshooting

### Frontend não carrega
- Verifique se o build command está correto
- Verifique se o output directory está correto: `dist/frontend/browser`

### Erro 404 ao navegar
- Certifique-se que o `vercel.json` está correto e tem as rotas configuradas

### API calls falhando
- Verifique se a variável `API_URL` está configurada
- Verifique se o backend está rodando
- Verifique CORS no backend

## 📞 Suporte

Se encontrar problemas, verifique os logs no dashboard do Vercel em "Deployments" > selecione o deploy > "View Function Logs"
