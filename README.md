# Unilever Corporate Quiz Platform

Production deployment on Vercel.

## Environment Variables

Create a `.env` file in the root directory with:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-here"
OPENAI_API_KEY="your-openai-key-here"
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm install
npm run vercel-build
```

### Backend
Deploy separately or use serverless functions.

## Access

- **Admin**: admin@unilever.com / admin123
- **Colaborador**: user@unilever.com / admin123
