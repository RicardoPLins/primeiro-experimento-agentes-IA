import { CorrecaoProcessada, CorrecaoProcessadaModel } from '../database/correcao-processada.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório para Correção Processada
 */
export class CorrecaoProcessadaRepository {
  /**
   * Criar nova correção processada
   */
  async criar(
    correcaoProcessada: Omit<CorrecaoProcessada, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CorrecaoProcessada> {
    const correcaoComId: CorrecaoProcessada = {
      ...correcaoProcessada,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doc = await CorrecaoProcessadaModel.create(correcaoComId);
    return doc.toObject();
  }

  /**
   * Buscar por ID
   */
  async buscarPorId(id: string): Promise<CorrecaoProcessada | null> {
    const doc = await CorrecaoProcessadaModel.findOne({ id });
    return doc ? doc.toObject() : null;
  }

  /**
   * Listar todas as correções processadas
   */
  async listar(): Promise<CorrecaoProcessada[]> {
    const docs = await CorrecaoProcessadaModel.find({}).sort({ dataProcessamento: -1 });
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Listar correções processadas por período
   */
  async listarPorPeriodo(dataInicio: Date, dataFim: Date): Promise<CorrecaoProcessada[]> {
    const docs = await CorrecaoProcessadaModel.find({
      dataProcessamento: { $gte: dataInicio, $lte: dataFim },
    }).sort({ dataProcessamento: -1 });
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Deletar correção processada
   */
  async deletar(id: string): Promise<boolean> {
    const resultado = await CorrecaoProcessadaModel.deleteOne({ id });
    return resultado.deletedCount > 0;
  }

  /**
   * Contar correções processadas
   */
  async contar(): Promise<number> {
    return CorrecaoProcessadaModel.countDocuments({});
  }
}

export default new CorrecaoProcessadaRepository();
