import { Request, Response } from 'express';
import correcaoProcessadaService from '../services/correcao-processada.service';
import { ApplicationError } from '../errors/ApplicationError';

/**
 * Controller de Correção Processada
 */
export class CorrecaoProcessadaController {
  /**
   * POST /api/correcoes-processadas
   * Salvar uma correção processada (lote)
   */
  async salvar(req: Request, res: Response): Promise<void> {
    try {
      const { nomeLote, modoCorrecao, relatorios } = req.body;

      console.log(`[CorrecaoProcessadaController.salvar] Salvando lote: ${nomeLote}`);

      if (!nomeLote || !modoCorrecao || !relatorios || !Array.isArray(relatorios)) {
        res.status(400).json({
          message: 'Campo nomeLote, modoCorrecao e relatorios (array) são obrigatórios',
        });
        return;
      }

      const correcaoSalva = await correcaoProcessadaService.salvarCorrecaoProcessada(
        nomeLote,
        modoCorrecao,
        relatorios
      );

      res.status(201).json({
        message: 'Correção processada salva com sucesso',
        correcao: correcaoSalva,
      });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /api/correcoes-processadas
   * Listar todas as correções processadas
   */
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      console.log('[CorrecaoProcessadaController.listar] Listando correções processadas');

      const correcoes = await correcaoProcessadaService.listar();

      // Desabilitar cache
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');

      res.status(200).json({
        message: `${correcoes.length} correções processadas encontradas`,
        correcoes,
      });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /api/correcoes-processadas/:id
   * Obter uma correção processada específica
   */
  async obter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(`[CorrecaoProcessadaController.obter] Buscando ${id}`);

      const correcao = await correcaoProcessadaService.obterPorId(id);

      if (!correcao) {
        res.status(404).json({ message: 'Correção processada não encontrada' });
        return;
      }

      // Desabilitar cache
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');

      res.status(200).json(correcao);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * DELETE /api/correcoes-processadas/:id
   * Deletar uma correção processada
   */
  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(`[CorrecaoProcessadaController.deletar] Deletando ${id}`);

      const deletado = await correcaoProcessadaService.deletar(id);

      if (!deletado) {
        res.status(404).json({ message: 'Correção processada não encontrada' });
        return;
      }

      res.status(200).json({ message: 'Correção processada deletada com sucesso' });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * Tratador de erros
   */
  private tratarErro(erro: any, res: Response): void {
    if (erro instanceof ApplicationError) {
      res.status(erro.statusCode).json({
        message: erro.message,
        ...(erro.details && { details: erro.details }),
      });
    } else {
      console.error('[CorrecaoProcessadaController] Erro não tratado:', erro);
      res.status(500).json({
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? erro.message : undefined,
      });
    }
  }
}

export default new CorrecaoProcessadaController();
