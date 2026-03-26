import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import 'dotenv/config';
import mongoConnection from '../sistema/backend/src/database/mongo';
import questaoRoutes from '../sistema/backend/src/routes/questao.routes';
import provaRoutes from '../sistema/backend/src/routes/prova.routes';
import provaIndividualRoutes from '../sistema/backend/src/routes/prova-individual.routes';
import correcaoRoutes from '../sistema/backend/src/routes/correcao.routes';
import { ApplicationError } from '../sistema/backend/src/errors/ApplicationError';

const app: Application = express();

// Middleware de segurança e logging
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload());

// Middleware de debug para requisições POST
app.use((req: Request, _res: Response, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`[${req.method}] ${req.path}`, {
      body: JSON.stringify(req.body).substring(0, 500),
    });
  }
  next();
});

// Health-check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const isConnected = mongoConnection.isConnected();
  const status = isConnected ? 'ok' : 'database_unavailable';
  const statusCode = isConnected ? 200 : 503;

  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    database: isConnected ? 'connected' : 'disconnected',
  });
});

// Rotas da API
app.use('/api/questoes', questaoRoutes);
app.use('/api/provas', provaRoutes);
app.use('/api/provas', provaIndividualRoutes);
app.use('/api/correcoes', correcaoRoutes);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
