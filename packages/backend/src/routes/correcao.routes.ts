import { Router, Request, Response } from 'express';
import correcaoController from '../controllers/correcao.controller';
import correcaoProcessadaController from '../controllers/correcao-processada.controller';

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

/**
 * Rotas de Correção Processada (Lotes)
 */

// POST /api/correcao/processadas - Salvar correção processada
router.post(
  '/processadas',
  asyncHandler((req, res) => correcaoProcessadaController.salvar(req, res))
);

// GET /api/correcao/processadas - Listar correções processadas
router.get(
  '/processadas',
  asyncHandler((req, res) => correcaoProcessadaController.listar(req, res))
);

// GET /api/correcao/processadas/:id - Obter correção processada
router.get(
  '/processadas/:id',
  asyncHandler((req, res) => correcaoProcessadaController.obter(req, res))
);

// DELETE /api/correcao/processadas/:id - Deletar correção processada
router.delete(
  '/processadas/:id',
  asyncHandler((req, res) => correcaoProcessadaController.deletar(req, res))
);

// GET /api/correcao/estatisticas - Gerar estatísticas
router.get(
  '/estatisticas',
  asyncHandler((req, res) => correcaoController.gerarEstatisticas(req, res))
);

export default router;
