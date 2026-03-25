import { Request, Response } from 'express';
import provaIndividualService from '../services/prova-individual.service';
import relatorioProvaService from '../services/relatorio-prova.service';
import { ApplicationError } from '../errors/ApplicationError';

/**
 * Controller de Prova Individual
 */
export class ProvaIndividualController {
  /**
   * POST /provas/:id/gerar-individuais
   * Gerar múltiplas provas individuais
   */
  async gerarProvasIndividuais(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantidade } = req.body;

      console.log(`[ProvaIndividualController.gerarProvasIndividuais] Gerando ${quantidade} provas`);

      const provasIndividuais = await provaIndividualService.gerarProvasIndividuais(
        id,
        quantidade
      );

      res.status(201).json({
        message: `${provasIndividuais.length} provas individuais geradas`,
        quantidade: provasIndividuais.length,
        provas: provasIndividuais,
      });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /provas/:id/provas-individuais
   * Listar provas individuais de uma prova
   */
  async listarProvasIndividuais(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(`[ProvaIndividualController.listarProvasIndividuais] Listando provas de ${id}`);

      const provasIndividuais = await provaIndividualService.listarPorProva(id);

      res.status(200).json({
        quantidade: provasIndividuais.length,
        provas: provasIndividuais,
      });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /provas/:id/pdf/:numeroProva
   * Download PDF de uma prova individual
   */
  async downloadPDF(req: Request, res: Response): Promise<void> {
    try {
      const { id, numeroProva } = req.params;

      console.log(`[ProvaIndividualController.downloadPDF] Baixando PDF prova ${numeroProva}`);

      const pdf = await relatorioProvaService.gerarPDFProvaIndividual(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="prova-${numeroProva}.pdf"`);
      res.send(pdf);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /provas/:id/gabarito.csv
   * Download CSV com gabaritos
   */
  async downloadGabarito(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(`[ProvaIndividualController.downloadGabarito] Gerando CSV para ${id}`);

      const csv = await relatorioProvaService.gerarCSVGabarito(id);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="gabarito-${id}.csv"`);
      res.send(csv);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * Tratador centralizado de erros
   */
  private tratarErro(erro: unknown, res: Response): void {
    if (erro instanceof ApplicationError) {
      console.warn(`[ProvaIndividualController] ${erro.code}: ${erro.message}`, erro.details);
      res.status(erro.statusCode).json({
        code: erro.code,
        message: erro.message,
        details: erro.details,
      });
    } else if (erro instanceof Error) {
      console.error('[ProvaIndividualController] Erro não tratado:', {
        name: erro.name,
        message: erro.message,
        stack: erro.stack,
      });
      res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: erro.message || 'Erro interno do servidor',
      });
    } else {
      console.error('[ProvaIndividualController] Erro desconhecido:', erro);
      res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }
}

export default new ProvaIndividualController();
