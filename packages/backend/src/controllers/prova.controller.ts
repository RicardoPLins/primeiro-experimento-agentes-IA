import { Request, Response } from 'express';
import provaService from '../services/prova.service';
import { ApplicationError } from '../errors/ApplicationError';
import { Identificacao } from '@gerenciador-provas/shared';

/**
 * Controller de Prova
 */
export class ProvaController {
  /**
   * POST /provas
   * Criar nova prova
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, disciplina, professor, data, turma, identificacao, questoesIds } = req.body;
      const prova = await provaService.criar(
        nome,
        disciplina,
        professor,
        new Date(data),
        turma,
        identificacao as Identificacao,
        questoesIds
      );
      res.status(201).json(prova);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /provas/:id
   * Buscar prova por ID
   */
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const prova = await provaService.buscarPorId(id);
      res.status(200).json(prova);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /provas
   * Listar todas as provas
   */
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const provas = await provaService.listarTodas();
      res.status(200).json(provas);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * PUT /provas/:id
   * Atualizar prova
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, disciplina, professor, data, turma, identificacao, questoesIds } = req.body;

      const atualizacoes: any = {};
      if (nome !== undefined) atualizacoes.nome = nome;
      if (disciplina !== undefined) atualizacoes.disciplina = disciplina;
      if (professor !== undefined) atualizacoes.professor = professor;
      if (data !== undefined) atualizacoes.data = new Date(data);
      if (turma !== undefined) atualizacoes.turma = turma;
      if (identificacao !== undefined) atualizacoes.identificacao = identificacao;
      if (questoesIds !== undefined) atualizacoes.questoesIds = questoesIds;

      const prova = await provaService.atualizar(id, atualizacoes);
      res.status(200).json(prova);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * DELETE /provas/:id
   * Excluir prova
   */
  async excluir(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await provaService.excluir(id);
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

export default new ProvaController();
