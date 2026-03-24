import { Request, Response } from 'express';
import questaoService from '../services/questao.service';
import { ApplicationError } from '../errors/ApplicationError';

/**
 * Controller de Questão
 * INV-BKD-13: Controllers tratam HTTP; services contêm lógica de domínio
 */
export class QuestaoController {
  /**
   * POST /questoes
   * Criar nova questão
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const { enunciado, alternativas } = req.body;
      const questao = await questaoService.criar(enunciado, alternativas);
      res.status(201).json(questao);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /questoes/:id
   * Buscar questão por ID
   */
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const questao = await questaoService.buscarPorId(id);
      res.status(200).json(questao);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /questoes
   * Listar todas as questões
   */
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const questoes = await questaoService.listarTodas();
      res.status(200).json(questoes);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * PUT /questoes/:id
   * Atualizar questão
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { enunciado, alternativas } = req.body;
      const questao = await questaoService.atualizar(id, enunciado, alternativas);
      res.status(200).json(questao);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * DELETE /questoes/:id
   * Excluir questão
   */
  async excluir(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await questaoService.excluir(id);
      res.status(204).send();
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * Tratador centralizado de erros
   */
  private tratarErro(erro: unknown, res: Response): void {
    if (erro instanceof ApplicationError) {
      res.status(erro.statusCode).json({
        code: erro.code,
        message: erro.message,
        details: erro.details,
      });
    } else {
      console.error('[Erro não tratado]', erro);
      res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }
}

export default new QuestaoController();
