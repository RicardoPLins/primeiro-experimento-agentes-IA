import { RelatorioNotas } from '@gerenciador-provas/shared';
import { RelatorioNotasModel } from '../database/relatorio-notas.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório para Relatório de Notas
 */
export class RelatorioNotasRepository {
  /**
   * Criar novo relatório
   */
  async criar(
    relatorio: Omit<RelatorioNotas, 'id' | 'createdAt'>
  ): Promise<RelatorioNotas> {
    const relatorioComId: RelatorioNotas = {
      ...relatorio,
      id: uuidv4(),
      createdAt: new Date(),
    };

    const doc = await RelatorioNotasModel.create(relatorioComId);
    return doc.toObject();
  }

  /**
   * Buscar relatório por email
   */
  async buscarPorEmail(email: string): Promise<RelatorioNotas | null> {
    const doc = await RelatorioNotasModel.findOne({ email });
    return doc ? doc.toObject() : null;
  }

  /**
   * Buscar relatório por ID
   */
  async buscarPorId(id: string): Promise<RelatorioNotas | null> {
    const doc = await RelatorioNotasModel.findOne({ id });
    return doc ? doc.toObject() : null;
  }

  /**
   * Listar todos os relatórios
   */
  async listarTodos(): Promise<RelatorioNotas[]> {
    const docs = await RelatorioNotasModel.find().sort({ createdAt: -1 });
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Listar relatórios com filtro de data
   */
  async listarPorData(dataInicio: Date, dataFim: Date): Promise<RelatorioNotas[]> {
    const docs = await RelatorioNotasModel.find({
      createdAt: { $gte: dataInicio, $lte: dataFim },
    }).sort({ createdAt: -1 });
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Contar total de relatórios
   */
  async contar(): Promise<number> {
    return RelatorioNotasModel.countDocuments();
  }
}

export default new RelatorioNotasRepository();
