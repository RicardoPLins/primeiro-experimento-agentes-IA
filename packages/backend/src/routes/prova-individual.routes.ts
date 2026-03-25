import { Router, Request, Response } from 'express';
import provaIndividualController from '../controllers/prova-individual.controller';

const router = Router({ mergeParams: true });

/**
 * Wrapper para tratamento de erros async
 */
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: any) => fn(req, res).catch(next);

/**
 * Rotas de Prova Individual
 */

// POST /api/provas/:id/gerar-individuais - Gerar provas individuais
router.post(
  '/:id/gerar-individuais',
  asyncHandler((req, res) => provaIndividualController.gerarProvasIndividuais(req, res))
);

// GET /api/provas/:id/provas-individuais - Listar provas individuais
router.get(
  '/:id/provas-individuais',
  asyncHandler((req, res) => provaIndividualController.listarProvasIndividuais(req, res))
);

// GET /api/provas/:id/pdf/:numeroProva - Download PDF
router.get(
  '/:id/pdf/:numeroProva',
  asyncHandler((req, res) => provaIndividualController.downloadPDF(req, res))
);

// GET /api/provas/:id/gabarito.csv - Download gabarito CSV
router.get(
  '/:id/gabarito.csv',
  asyncHandler((req, res) => provaIndividualController.downloadGabarito(req, res))
);

// GET /api/provas/:id/pdfs.zip - Download ZIP com todos os PDFs
router.get(
  '/:id/pdfs.zip',
  asyncHandler((req, res) => provaIndividualController.downloadZip(req, res))
);

// GET /api/provas/:id/estatisticas - Obter estatísticas
router.get(
  '/:id/estatisticas',
  asyncHandler((req, res) => provaIndividualController.getEstatisticas(req, res))
);

export default router;
