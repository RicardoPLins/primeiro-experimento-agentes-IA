import { Request, Response } from 'express';
import provaIndividualService from '../services/prova-individual.service';
import relatorioProvaService from '../services/relatorio-prova.service';
import { ApplicationError } from '../errors/ApplicationError';

const archiver = require('archiver');

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

      console.log(`[ProvaIndividualController.downloadPDF] Baixando PDF prova ${numeroProva} da prova ${id}`);

      // Buscar prova individual pelo número dentro de uma prova específica
      const provasIndividuais = await provaIndividualService.listarPorProva(id);
      const provaIndividual = provasIndividuais.find(
        (p) => p.numero === parseInt(numeroProva)
      );

      if (!provaIndividual) {
        throw new ApplicationError('NOT_FOUND', `Prova individual ${numeroProva} não encontrada`, 404);
      }

      const pdf = await relatorioProvaService.gerarPDFProvaIndividual(provaIndividual.id);

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
   * GET /provas/:id/pdfs.zip
   * Download ZIP com todos os PDFs de provas individuais
   */
  async downloadZip(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(`[ProvaIndividualController.downloadZip] Gerando ZIP para ${id}`);

      // Buscar todas as provas individuais
      const provas = await provaIndividualService.listarPorProva(id);

      if (provas.length === 0) {
        throw new ApplicationError('NOT_FOUND', 'Nenhuma prova individual encontrada', 404);
      }

      // Configurar resposta como ZIP
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="provas-${id}.zip"`);

      // Criar arquivo ZIP
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(res);

      // Adicionar cada PDF ao ZIP
      for (const prova of provas) {
        try {
          const pdf = await relatorioProvaService.gerarPDFProvaIndividual(id);
          archive.append(pdf, { name: `prova-${prova.numero}.pdf` });
        } catch (e) {
          console.warn(`[ProvaIndividualController.downloadZip] Erro ao gerar PDF ${prova.numero}:`, e);
        }
      }

      // Adicionar CSV com gabarito
      try {
        const csv = await relatorioProvaService.gerarCSVGabarito(id);
        archive.append(csv, { name: 'gabarito.csv' });
      } catch (e) {
        console.warn('[ProvaIndividualController.downloadZip] Erro ao gerar CSV:', e);
      }

      await archive.finalize();
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /provas/:id/estatisticas
   * Obter estatísticas de provas geradas
   */
  async getEstatisticas(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log(`[ProvaIndividualController.getEstatisticas] Obtendo stats para ${id}`);

      const provas = await provaIndividualService.listarPorProva(id);

      res.status(200).json({
        provaId: id,
        total: provas.length,
        primeiraGeracao: provas.length > 0 ? provas[0].createdAt : null,
        ultimaGeracao: provas.length > 0 ? provas[provas.length - 1].createdAt : null,
      });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  }

  /**
   * GET /provas/:id/provas/:numeroProva/embaralhamento
   * Obter informações de embaralhamento de uma prova individual
   */
  async getEmbaralhamento(req: Request, res: Response): Promise<void> {
    try {
      const { id, numeroProva } = req.params;

      console.log(`[ProvaIndividualController.getEmbaralhamento] Obtendo embaralhamento da prova ${numeroProva}`);

      const provas = await provaIndividualService.listarPorProva(id);
      const provaIndividual = provas.find((p) => p.numero === parseInt(numeroProva));

      if (!provaIndividual) {
        throw new ApplicationError('NOT_FOUND', 'Prova individual não encontrada', 404);
      }

      res.status(200).json({
        provaId: id,
        numeroProva: provaIndividual.numero,
        totalQuestoes: provaIndividual.questoesEmbaralhadas.length,
        embaralhamento: {
          questoes: provaIndividual.questoesEmbaralhadas.map((q, idx) => ({
            posicaoNaProva: idx + 1,
            questaoOriginal: q.questaoId,
            alternativasEmbaralhadas: q.alternativasEmbaralhadas,
          })),
          sementes: provaIndividual.sementes,
        },
      });
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
