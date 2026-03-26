import { Router, Request, Response } from 'express';
import correcaoController from '../controllers/correcao.controller';

const router = Router();

/**
 * Wrapper para tratamento de erros async
 */
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: any) => fn(req, res).catch(next);

/**
 * Rotas de Correção
 */

// POST /api/correcao - Corrigir provas (upload de CSVs)
router.post(
  '/',
  asyncHandler((req, res) => correcaoController.corrigirProvas(req, res))
);

// GET /api/correcao/relatorios - Listar todos os relatórios
router.get(
  '/relatorios',
  asyncHandler((req, res) => correcaoController.listarRelatorios(req, res))
);

// GET /api/correcao/relatorios/:id - Obter um relatório específico
router.get(
  '/relatorios/:id',
  asyncHandler((req, res) => correcaoController.obterRelatorio(req, res))
);

// GET /api/correcao/relatorios/email/:email - Obter relatório por email
router.get(
  '/relatorios/email/:email',
  asyncHandler((req, res) => correcaoController.obterRelatoriosPorEmail(req, res))
);

// DELETE /api/correcao/relatorios/:id - Deletar um relatório
router.delete(
  '/relatorios/:id',
  asyncHandler((req, res) => correcaoController.deletarRelatorio(req, res))
);

// GET /api/correcao/relatorios/:id/csv - Exportar CSV
router.get(
  '/relatorios/:id/csv',
  asyncHandler((req, res) => correcaoController.exportarCSV(req, res))
);

// GET /api/correcao/estatisticas - Gerar estatísticas
router.get(
  '/estatisticas',
  asyncHandler((req, res) => correcaoController.gerarEstatisticas(req, res))
);

export default router;
