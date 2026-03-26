import { Request, Response } from 'express';
import { ModoCorrecao } from '@gerenciador-provas/shared';
import correcaoService from '../services/correcao.service';
import relatorioNotasRepository from '../repositories/relatorio-notas.repository';
import { RelatorioNotasModel } from '../database/relatorio-notas.schema';
import { ValidationError } from '../errors/ApplicationError';

/**
 * Controller para Correção de Provas
 */
export class CorrecaoController {
  /**
   * POST /api/correcao
   * Corrigir provas enviando CSVs de gabarito e respostas
   */
  async corrigirProvas(req: Request, res: Response): Promise<void> {
    try {
      console.log('[CorrecaoController.corrigirProvas] Iniciando correção...');

      const { modoCorrecao } = req.body;

      const modo = (modoCorrecao || 'RIGOROSA') as ModoCorrecao;
      if (!['RIGOROSA', 'MENOS_RIGOROSA'].includes(modo)) {
        res.status(400).json({ erro: 'modoCorrecao inválido (RIGOROSA | MENOS_RIGOROSA)' });
        return;
      }

      // Verificar se foram enviados os CSVs
      const files = (req as any).files;
      if (!files || typeof files !== 'object') {
        res.status(400).json({ erro: 'Nenhum arquivo enviado' });
        return;
      }

      // Buscar arquivos
      const csvGabaritoFile = Array.isArray(files.csvGabarito)
        ? files.csvGabarito[0]
        : files.csvGabarito;
      const csvRespostasFile = Array.isArray(files.csvRespostas)
        ? files.csvRespostas[0]
        : files.csvRespostas;

      if (!csvGabaritoFile || !csvRespostasFile) {
        res.status(400).json({
          erro: 'Arquivos obrigatórios: csvGabarito, csvRespostas',
        });
        return;
      }

      // Ler conteúdos dos arquivos
      const csvGabaritoConteudo = csvGabaritoFile.data.toString('utf-8');
      const csvRespostasConteudo = csvRespostasFile.data.toString('utf-8');

      console.log('[CorrecaoController.corrigirProvas] CSVs recebidos');
      console.log(`  - Gabarito: ${csvGabaritoConteudo.length} bytes`);
      console.log(`  - Respostas: ${csvRespostasConteudo.length} bytes`);

      // Extrair provaId do primeiro campo (email) do gabarito CSV
      const linhasGabarito = csvGabaritoConteudo.trim().split('\n');
      if (linhasGabarito.length < 2) {
        res.status(400).json({ erro: 'CSV de gabarito inválido (deve ter header e pelo menos um registro)' });
        return;
      }

      const primeiraLinha = linhasGabarito[1].split(',')[0].trim();
      const provaId = primeiraLinha || 'prova-default';

      console.log(`[CorrecaoController.corrigirProvas] provaId extraído: ${provaId}`);

      // Executar correção
      const relatorios = await correcaoService.corrigirProvas(
        provaId,
        csvGabaritoConteudo,
        csvRespostasConteudo,
        modo
      );

      // Gerar estatísticas
      const estatisticas = await correcaoService.gerarRelatorioCurva(relatorios);

      res.status(200).json({
        sucesso: true,
        totalRelatorios: relatorios.length,
        relatorios: relatorios.slice(0, 10), // Retornar primeiros 10
        estatisticas,
        mensagem: `Correção concluída! ${relatorios.length} alunos corrigidos`,
      });

      console.log('[CorrecaoController.corrigirProvas] ✅ Correção concluída com sucesso');
    } catch (error) {
      console.error('[CorrecaoController.corrigirProvas] Erro:', error);

      res.status(400).json({
        erro:
          error instanceof Error
            ? error.message
            : 'Erro ao corrigir provas',
        detalhes: error instanceof ValidationError ? error.details : undefined,
      });
    }
  }

  /**
   * GET /api/correcao/relatorios
   * Listar todos os relatórios de notas
   */
  async listarRelatorios(_req: Request, res: Response): Promise<void> {
    try {
      console.log('[CorrecaoController.listarRelatorios] Listando relatórios...');

      const relatorios = await relatorioNotasRepository.listarTodos();

      res.status(200).json({
        sucesso: true,
        total: relatorios.length,
        relatorios,
      });
    } catch (error) {
      console.error('[CorrecaoController.listarRelatorios] Erro:', error);
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao listar relatórios',
      });
    }
  }

  /**
   * GET /api/correcao/relatorios/:id
   * Obter um relatório específico
   */
  async obterRelatorio(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log('[CorrecaoController.obterRelatorio] Buscando relatório:', id);

      const relatorio = await relatorioNotasRepository.buscarPorId(id);

      if (!relatorio) {
        res.status(404).json({ erro: 'Relatório não encontrado' });
        return;
      }

      res.status(200).json({
        sucesso: true,
        relatorio,
      });
    } catch (error) {
      console.error('[CorrecaoController.obterRelatorio] Erro:', error);
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao obter relatório',
      });
    }
  }

  /**
   * GET /api/correcao/relatorios/email/:email
   * Obter relatórios de um aluno por email
   */
  async obterRelatoriosPorEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      console.log('[CorrecaoController.obterRelatoriosPorEmail] Buscando relatórios de:', email);

      // Buscar o relatório por email
      const relatorio = await relatorioNotasRepository.buscarPorEmail(email);

      if (!relatorio) {
        res.status(404).json({ erro: 'Relatório não encontrado' });
        return;
      }

      res.status(200).json({
        sucesso: true,
        relatorio,
      });
    } catch (error) {
      console.error('[CorrecaoController.obterRelatoriosPorEmail] Erro:', error);
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao obter relatórios',
      });
    }
  }

  /**
   * GET /api/correcao/relatorios/:id/csv
   * Exportar relatório para CSV
   */
  async exportarCSV(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log('[CorrecaoController.exportarCSV] Exportando relatório:', id);

      const relatorios = await relatorioNotasRepository.listarTodos();
      const csv = await correcaoService.exportarCSV(relatorios);

      res.header('Content-Type', 'text/csv; charset=utf-8');
      res.header('Content-Disposition', `attachment; filename="relatorios-${Date.now()}.csv"`);
      res.send(csv);

      console.log('[CorrecaoController.exportarCSV] ✅ CSV exportado');
    } catch (error) {
      console.error('[CorrecaoController.exportarCSV] Erro:', error);
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao exportar CSV',
      });
    }
  }

  /**
   * DELETE /api/correcao/relatorios/:id
   * Deletar um relatório
   */
  async deletarRelatorio(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      console.log('[CorrecaoController.deletarRelatorio] Deletando relatório:', id);

      // Verificar se existe
      const relatorio = await relatorioNotasRepository.buscarPorId(id);
      if (!relatorio) {
        res.status(404).json({ erro: 'Relatório não encontrado' });
        return;
      }

      await RelatorioNotasModel.deleteOne({ id });

      res.status(200).json({
        sucesso: true,
        mensagem: 'Relatório deletado',
      });

      console.log('[CorrecaoController.deletarRelatorio] ✅ Relatório deletado');
    } catch (error) {
      console.error('[CorrecaoController.deletarRelatorio] Erro:', error);
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao deletar relatório',
      });
    }
  }

  /**
   * GET /api/correcao/estatisticas
   * Gerar estatísticas de todos os relatórios
   */
  async gerarEstatisticas(_req: Request, res: Response): Promise<void> {
    try {
      console.log('[CorrecaoController.gerarEstatisticas] Gerando estatísticas...');

      const relatorios = await relatorioNotasRepository.listarTodos();
      const estatisticas = await correcaoService.gerarRelatorioCurva(relatorios);

      res.status(200).json({
        sucesso: true,
        estatisticas,
        totalRelatorios: relatorios.length,
      });
    } catch (error) {
      console.error('[CorrecaoController.gerarEstatisticas] Erro:', error);
      res.status(400).json({
        erro: error instanceof Error ? error.message : 'Erro ao gerar estatísticas',
      });
    }
  }
}

export default new CorrecaoController();
