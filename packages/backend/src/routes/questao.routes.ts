import { Router } from 'express';
import questaoController from '../controllers/questao.controller';

const router = Router();

/**
 * Rotas de Questão
 * INV-BKD-14: Controllers tratam roteamento e delegam lógica
 */

// POST /api/questoes - Criar questão
router.post('/', (req, res) => questaoController.criar(req, res));

// GET /api/questoes - Listar questões
router.get('/', (req, res) => questaoController.listar(req, res));

// GET /api/questoes/:id - Buscar questão
router.get('/:id', (req, res) => questaoController.buscarPorId(req, res));

// PUT /api/questoes/:id - Atualizar questão
router.put('/:id', (req, res) => questaoController.atualizar(req, res));

// DELETE /api/questoes/:id - Excluir questão
router.delete('/:id', (req, res) => questaoController.excluir(req, res));

export default router;
