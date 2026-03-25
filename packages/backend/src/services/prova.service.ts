import { Prova, Identificacao } from '@gerenciador-provas/shared';
import provaRepository from '../repositories/prova.repository';
import questaoService from './questao.service';
import { ValidationError, NotFoundError } from '../errors/ApplicationError';

/**
 * Service de Prova
 * INV-BKD-12: Lógica de prova template centralizada
 */
export class ProvaService {
  /**
   * Criar nova prova
   * INV-PRV-01: Prova template DEVE referenciar 5 questões
   * INV-PRV-02: identificacao é um enum: LETRAS | POTENCIAS_DE_2
   */
  async criar(
    nome: string,
    disciplina: string,
    professor: string,
    data: Date,
    turma: string,
    identificacao: Identificacao,
    questoesIds: string[]
  ): Promise<Prova> {
    if (!nome || nome.trim().length === 0) {
      throw new ValidationError('Nome da prova não pode estar vazio', { nome });
    }

    if (questoesIds.length !== 5) {
      throw new ValidationError('Prova deve ter exatamente 5 questões', {
        fornecidas: questoesIds.length,
      });
    }

    if (!['LETRAS', 'POTENCIAS_DE_2'].includes(identificacao)) {
      throw new ValidationError('Identificação inválida', { identificacao });
    }

    // Validar se todas as questões existem
    const questoes = await questaoService.buscarPorIds(questoesIds);

    return provaRepository.criar({
      nome,
      disciplina,
      professor,
      data,
      turma,
      identificacao,
      questoes: questoes,
    });
  }

  /**
   * Buscar prova por ID
   */
  async buscarPorId(id: string): Promise<Prova> {
    const prova = await provaRepository.buscarPorId(id);
    if (!prova) {
      throw new NotFoundError('Prova', id);
    }
    return prova;
  }

  /**
   * Listar todas as provas
   */
  async listarTodas(): Promise<Prova[]> {
    return provaRepository.listarTodas();
  }

  /**
   * Atualizar prova
   */
  async atualizar(
    id: string,
    atualizacoes: Partial<Prova> & { questoesIds?: string[] }
  ): Promise<Prova> {
    await this.buscarPorId(id);

    // Se questoesIds foi fornecido, validar e converter
    if (atualizacoes.questoesIds) {
      if (atualizacoes.questoesIds.length !== 5) {
        throw new ValidationError('Prova deve ter exatamente 5 questões', {
          fornecidas: atualizacoes.questoesIds.length,
        });
      }
      const questoes = await questaoService.buscarPorIds(atualizacoes.questoesIds);
      atualizacoes.questoes = questoes;
      delete (atualizacoes as any).questoesIds;
    }

    if (atualizacoes.questoes && atualizacoes.questoes.length !== 5) {
      throw new ValidationError('Prova deve ter exatamente 5 questões', {
        fornecidas: atualizacoes.questoes.length,
      });
    }

    const provaAtualizada = await provaRepository.atualizar(id, atualizacoes);
    if (!provaAtualizada) {
      throw new NotFoundError('Prova', id);
    }
    return provaAtualizada;
  }

  /**
   * Excluir prova
   */
  async excluir(id: string): Promise<void> {
    await this.buscarPorId(id);
    await provaRepository.excluir(id);
  }
}

export default new ProvaService();
