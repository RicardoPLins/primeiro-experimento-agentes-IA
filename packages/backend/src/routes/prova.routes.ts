import { Router } from 'express';
import provaController from '../controllers/prova.controller';

const router = Router();

/**
 * Rotas de Prova
 */

// POST /api/provas - Criar prova
router.post('/', (req, res) => provaController.criar(req, res));

// GET /api/provas - Listar provas
router.get('/', (req, res) => provaController.listar(req, res));

// GET /api/provas/:id - Buscar prova
router.get('/:id', (req, res) => provaController.buscarPorId(req, res));

// PUT /api/provas/:id - Atualizar prova
router.put('/:id', (req, res) => provaController.atualizar(req, res));

// DELETE /api/provas/:id - Excluir prova
router.delete('/:id', (req, res) => provaController.excluir(req, res));

export default router;
