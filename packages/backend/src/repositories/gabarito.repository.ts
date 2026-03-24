import { Gabarito } from '@gerenciador-provas/shared';
import { GabaritoModel } from '../database/gabarito.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repositório para Gabarito
 */
export class GabaritoRepository {
  /**
   * Criar novo gabarito
   */
  async criar(
    gabarito: Omit<Gabarito, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Gabarito> {
    const gabaritoComId: Gabarito = {
      ...gabarito,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const doc = await GabaritoModel.create(gabaritoComId);
    return doc.toObject();
  }

  /**
   * Buscar gabarito por prova individual
   */
  async buscarPorProvaIndividual(provaIndividualId: string): Promise<Gabarito | null> {
    const doc = await GabaritoModel.findOne({ provaIndividualId });
    return doc ? doc.toObject() : null;
  }

  /**
   * Buscar gabarito por ID
   */
  async buscarPorId(id: string): Promise<Gabarito | null> {
    const doc = await GabaritoModel.findOne({ id });
    return doc ? doc.toObject() : null;
  }

  /**
   * Listar gabaritos por número
   */
  async listarPorNumero(numero: number): Promise<Gabarito[]> {
    const docs = await GabaritoModel.find({ numero });
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Atualizar gabarito
   */
  async atualizar(id: string, atualizacoes: Partial<Gabarito>): Promise<Gabarito | null> {
    const doc = await GabaritoModel.findOneAndUpdate(
      { id },
      { ...atualizacoes, updatedAt: new Date() },
      { new: true }
    );
    return doc ? doc.toObject() : null;
  }
}

export default new GabaritoRepository();
