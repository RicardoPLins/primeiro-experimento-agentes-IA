import { Questao } from '@gerenciador-provas/shared';
import { QuestaoModel } from '../database/questao.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório para Questão
 * INV-BKD-06: Padrão Repository centraliza acesso ao banco
 */
export class QuestaoRepository {
  /**
   * Criar nova questão
   */
  async criar(questao: Omit<Questao, 'id' | 'createdAt' | 'updatedAt'>): Promise<Questao> {
    const questaoComId: Questao = {
      ...questao,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doc = await QuestaoModel.create(questaoComId);
    return doc.toObject();
  }

  /**
   * Buscar questão por ID
   */
  async buscarPorId(id: string): Promise<Questao | null> {
    const doc = await QuestaoModel.findOne({ id });
    return doc ? doc.toObject() : null;
  }

  /**
   * Listar todas as questões
   */
  async listarTodas(): Promise<Questao[]> {
    const docs = await QuestaoModel.find();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Atualizar questão
   */
  async atualizar(id: string, atualizacoes: Partial<Questao>): Promise<Questao | null> {
    const doc = await QuestaoModel.findOneAndUpdate(
      { id },
      { ...atualizacoes, updatedAt: new Date() },
      { new: true }
    );
    return doc ? doc.toObject() : null;
  }

  /**
   * Excluir questão
   * INV-BKD-07: Bloqueado em nível de service, não aqui
   */
  async excluir(id: string): Promise<boolean> {
    const resultado = await QuestaoModel.deleteOne({ id });
    return resultado.deletedCount > 0;
  }

  /**
   * Buscar questões por IDs (para prova)
   */
  async buscarPorIds(ids: string[]): Promise<Questao[]> {
    const docs = await QuestaoModel.find({ id: { $in: ids } });
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Contar total de questões
   */
  async contar(): Promise<number> {
    return QuestaoModel.countDocuments();
  }
}

export default new QuestaoRepository();
