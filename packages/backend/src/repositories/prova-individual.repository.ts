import { ProvaIndividual } from '@gerenciador-provas/shared';
import { ProvaIndividualModel } from '../database/prova-individual.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório para Prova Individual
 */
export class ProvaIndividualRepository {
  /**
   * Criar nova prova individual
   */
  async criar(
    provaIndividual: Omit<ProvaIndividual, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ProvaIndividual> {
    const provaComId: ProvaIndividual = {
      ...provaIndividual,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doc = await ProvaIndividualModel.create(provaComId);
    return doc.toObject();
  }

  /**
   * Buscar por ID
   */
  async buscarPorId(id: string): Promise<ProvaIndividual | null> {
    const doc = await ProvaIndividualModel.findOne({ id });
    return doc ? doc.toObject() : null;
  }

  /**
   * Buscar prova individual por provaId e número
   * INV-BKD-09: Índice composto garante unicidade
   */
  async buscarPorProvaENumero(provaId: string, numero: number): Promise<ProvaIndividual | null> {
    const doc = await ProvaIndividualModel.findOne({ provaId, numero });
    return doc ? doc.toObject() : null;
  }

  /**
   * Listar todas as provas individuais de uma prova
   */
  async listarPorProva(provaId: string): Promise<ProvaIndividual[]> {
    const docs = await ProvaIndividualModel.find({ provaId }).sort({ numero: 1 });
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Próximo número disponível para uma prova
   */
  async proximoNumero(provaId: string): Promise<number> {
    const ultimo = await ProvaIndividualModel.findOne({ provaId }).sort({ numero: -1 });
    return (ultimo?.numero || 0) + 1;
  }

  /**
   * Atualizar prova individual
   */
  async atualizar(
    id: string,
    atualizacoes: Partial<ProvaIndividual>
  ): Promise<ProvaIndividual | null> {
    const doc = await ProvaIndividualModel.findOneAndUpdate(
      { id },
      { ...atualizacoes, updatedAt: new Date() },
      { new: true }
    );
    return doc ? doc.toObject() : null;
  }

  /**
   * Excluir prova individual
   */
  async excluir(id: string): Promise<boolean> {
    const resultado = await ProvaIndividualModel.deleteOne({ id });
    return resultado.deletedCount > 0;
  }

  /**
   * Contar provas individuais de uma prova
   */
  async contarPorProva(provaId: string): Promise<number> {
    return ProvaIndividualModel.countDocuments({ provaId });
  }
}

export default new ProvaIndividualRepository();
