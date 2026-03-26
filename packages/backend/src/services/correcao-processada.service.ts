import correcaoProcessadaRepository from '../repositories/correcao-processada.repository';
import { CorrecaoProcessada } from '../database/correcao-processada.schema';

/**
 * Service para Correção Processada
 */
export class CorrecaoProcessadaService {
  /**
   * Salvar correção processada
   */
  async salvarCorrecaoProcessada(
    nomeLote: string,
    modoCorrecao: string,
    relatorios: any[] // Aceita qualquer formato do frontend
  ): Promise<CorrecaoProcessada> {
    try {
      console.log(`[CorrecaoProcessadaService.salvarCorrecaoProcessada] Salvando lote: ${nomeLote}`);

      // Calcular estatísticas
      const notasFinal = relatorios.map((r) => r.notaFinal);
      const mediaGeral = notasFinal.reduce((a, b) => a + b, 0) / notasFinal.length;
      const notaMaxima = Math.max(...notasFinal);
      const notaMinima = Math.min(...notasFinal);

      // Preparar dados para salvar
      const correcaoProcessada: Omit<CorrecaoProcessada, 'id' | 'createdAt' | 'updatedAt'> = {
        nomeLote,
        dataProcessamento: new Date(),
        modoCorrecao,
        totalAlunos: relatorios.length,
        mediaGeral,
        notaMaxima,
        notaMinima,
        relatorios: relatorios.map((r) => ({
          nome: r.nome || 'N/A',
          cpf: r.cpf || 'N/A',
          notaFinal: r.notaFinal,
          modo: r.modo || modoCorrecao,
          acertos: r.acertos || (r.notas ? r.notas.filter((n: any) => n.nota > 0).length : 0),
          totalQuestoes: r.totalQuestoes || (r.notas ? r.notas.length : 0),
        })),
      };

      const correcaoSalva = await correcaoProcessadaRepository.criar(correcaoProcessada);

      console.log(`✅ Correção processada salva: ${correcaoSalva.id}`);
      return correcaoSalva;
    } catch (error) {
      console.error('❌ Erro ao salvar correção processada:', error);
      throw error;
    }
  }

  /**
   * Listar todas as correções processadas
   */
  async listar(): Promise<CorrecaoProcessada[]> {
    console.log('[CorrecaoProcessadaService.listar] Listando correções processadas');
    return correcaoProcessadaRepository.listar();
  }

  /**
   * Obter correção processada por ID
   */
  async obterPorId(id: string): Promise<CorrecaoProcessada | null> {
    console.log(`[CorrecaoProcessadaService.obterPorId] Buscando ${id}`);
    return correcaoProcessadaRepository.buscarPorId(id);
  }

  /**
   * Deletar correção processada
   */
  async deletar(id: string): Promise<boolean> {
    console.log(`[CorrecaoProcessadaService.deletar] Deletando ${id}`);
    return correcaoProcessadaRepository.deletar(id);
  }
}

export default new CorrecaoProcessadaService();
