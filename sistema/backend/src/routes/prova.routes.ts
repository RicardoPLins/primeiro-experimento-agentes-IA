import { Router, Request, Response } from 'express';
import provaController from '../controllers/prova.controller';

const router = Router();

/**
 * Wrapper para tratamento de erros async
 */
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
  (req: Request, res: Response, next: any) => fn(req, res).catch(next);

/**
 * Rotas de Prova
 */

// POST /api/provas - Criar prova
router.post('/', asyncHandler((req, res) => provaController.criar(req, res)));

// GET /api/provas - Listar provas
router.get('/', asyncHandler((req, res) => provaController.listar(req, res)));

// GET /api/provas/:id - Buscar prova
router.get('/:id', asyncHandler((req, res) => provaController.buscarPorId(req, res)));

// PUT /api/provas/:id - Atualizar prova
router.put('/:id', asyncHandler((req, res) => provaController.atualizar(req, res)));

// DELETE /api/provas/:id - Excluir prova
router.delete('/:id', asyncHandler((req, res) => provaController.excluir(req, res)));

export default router;
