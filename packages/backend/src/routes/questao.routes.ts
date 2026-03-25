import { Router, Request, Response } from 'express';
import questaoController from '../controllers/questao.controller';

const router = Router();

/**
 * Wrapper para tratamento de erros async
 */
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
  (req: Request, res: Response, next: any) => fn(req, res).catch(next);

/**
 * Rotas de Questão
 * INV-BKD-14: Controllers tratam roteamento e delegam lógica
 */

// POST /api/questoes - Criar questão
router.post('/', asyncHandler((req, res) => questaoController.criar(req, res)));

// GET /api/questoes - Listar questões
router.get('/', asyncHandler((req, res) => questaoController.listar(req, res)));

// GET /api/questoes/:id - Buscar questão
router.get('/:id', asyncHandler((req, res) => questaoController.buscarPorId(req, res)));

// PUT /api/questoes/:id - Atualizar questão
router.put('/:id', asyncHandler((req, res) => questaoController.atualizar(req, res)));

// DELETE /api/questoes/:id - Excluir questão
router.delete('/:id', asyncHandler((req, res) => questaoController.excluir(req, res)));

export default router;
