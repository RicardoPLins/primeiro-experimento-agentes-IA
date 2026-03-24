import { Prova } from '@gerenciador-provas/shared';
import { ProvaModel } from '../database/prova.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório para Prova (template)
 */
export class ProvaRepository {
  /**
   * Criar nova prova
   */
  async criar(prova: Omit<Prova, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prova> {
    const provaComId: Prova = {
      ...prova,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doc = await ProvaModel.create(provaComId);
    return doc.toObject();
  }

  /**
   * Buscar prova por ID
   */
  async buscarPorId(id: string): Promise<Prova | null> {
    const doc = await ProvaModel.findOne({ id }).populate('questoes');
    return doc ? doc.toObject() : null;
  }

  /**
   * Listar todas as provas
   */
  async listarTodas(): Promise<Prova[]> {
    const docs = await ProvaModel.find();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Atualizar prova
   */
  async atualizar(id: string, atualizacoes: Partial<Prova>): Promise<Prova | null> {
    const doc = await ProvaModel.findOneAndUpdate(
      { id },
      { ...atualizacoes, updatedAt: new Date() },
      { new: true }
    );
    return doc ? doc.toObject() : null;
  }

  /**
   * Excluir prova
   */
  async excluir(id: string): Promise<boolean> {
    const resultado = await ProvaModel.deleteOne({ id });
    return resultado.deletedCount > 0;
  }

  /**
   * Verificar se questão está vinculada a uma prova
   * INV-BKD-08: Integridade referencial na camada de service
   */
  async questaoEstaVinculada(questaoId: string): Promise<boolean> {
    const count = await ProvaModel.countDocuments({ questoes: questaoId });
    return count > 0;
  }

  /**
   * Contar total de provas
   */
  async contar(): Promise<number> {
    return ProvaModel.countDocuments();
  }
}

export default new ProvaRepository();
