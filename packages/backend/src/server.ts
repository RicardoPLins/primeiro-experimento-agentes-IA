import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import mongoConnection from './database/mongo';
import questaoRoutes from './routes/questao.routes';
import provaRoutes from './routes/prova.routes';
import { ApplicationError } from './errors/ApplicationError';

const app: Application = express();

// Middleware de segurança e logging
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health-check endpoint
app.get('/health', async (req: Request, res: Response) => {
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

// Middleware de tratamento de erros global
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
  } else if (err instanceof Error) {
    console.error('[Erro não tratado]', err);
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message,
    });
  } else {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno do servidor',
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: `Rota ${req.method} ${req.path} não encontrada`,
  });
});

const PORT = process.env.PORT || 3000;

/**
 * Inicializar servidor
 */
async function inicializar(): Promise<void> {
  try {
    // Conectar ao MongoDB
    await mongoConnection.connect();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`[${new Date().toISOString()}] Servidor rodando em http://localhost:${PORT}`);
      console.log(`[${new Date().toISOString()}] Health-check: http://localhost:${PORT}/health`);
    });
  } catch (erro) {
    console.error('[Erro ao inicializar]', erro);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[SIGTERM] Encerrando servidor...');
  await mongoConnection.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[SIGINT] Encerrando servidor...');
  await mongoConnection.disconnect();
  process.exit(0);
});

inicializar();

export default app;
