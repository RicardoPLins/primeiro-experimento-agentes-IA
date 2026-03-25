import { Prova } from '@gerenciador-provas/shared';
import { ProvaModel } from '../database/prova.schema';
import { QuestaoModel } from '../database/questao.schema';
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

    // Extrair apenas os IDs das questões para salvar no MongoDB
    const dadosParaSalvar = {
      ...provaComId,
      questoes: prova.questoes.map((q) => (typeof q === 'string' ? q : q.id)),
    };

    await ProvaModel.create(dadosParaSalvar);
    
    // Buscar a prova criada e popular as questões manualmente
    return this.buscarPorId(provaComId.id) as Promise<Prova>;
  }

  /**
   * Método auxiliar para popular questões manualmente
   */
  private async populateQuestoes(doc: any): Promise<Prova> {
    if (!doc) return null as any;
    const prova = doc.toObject();
    if (prova.questoes && Array.isArray(prova.questoes)) {
      const questoesIds = prova.questoes.filter((q: any): q is string => typeof q === 'string');
      if (questoesIds.length > 0) {
        try {
          // Usar .lean() para evitar problemas com ObjectId
          const questoes = await QuestaoModel.find({ id: { $in: questoesIds } }).lean().exec();
          prova.questoes = questoesIds.map(
            (id: string) => questoes.find((q: any) => q.id === id) || { id }
          ) as any;
        } catch (erro) {
          console.error('[ProvaRepository] Erro ao popular questões:', erro);
          // Se falhar, apenas retorna os IDs
          prova.questoes = questoesIds as any;
        }
      }
    }
    return prova;
  }

  /**
   * Buscar prova por ID
   */
  async buscarPorId(id: string): Promise<Prova | null> {
    const doc = await ProvaModel.findOne({ id });
    if (!doc) return null;
    return this.populateQuestoes(doc);
  }

  /**
   * Listar todas as provas
   */
  async listarTodas(): Promise<Prova[]> {
    const docs = await ProvaModel.find();
    return Promise.all(docs.map((doc) => this.populateQuestoes(doc)));
  }

  /**
   * Atualizar prova
   */
  async atualizar(id: string, atualizacoes: Partial<Prova>): Promise<Prova | null> {
    // Extrair apenas os IDs das questões se estiverem sendo atualizadas
    const dados: any = {
      ...atualizacoes,
      updatedAt: new Date(),
    };
    
    if (dados.questoes) {
      dados.questoes = dados.questoes.map((q: any) => (typeof q === 'string' ? q : q.id));
    }

    const doc = await ProvaModel.findOneAndUpdate(
      { id },
      dados,
      { new: true }
    );
    if (!doc) return null;
    return this.populateQuestoes(doc);
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
