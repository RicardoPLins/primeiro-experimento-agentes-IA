import { Questao, Alternativa } from '@gerenciador-provas/shared';
import questaoRepository from '../repositories/questao.repository';
import provaRepository from '../repositories/prova.repository';
import { ValidationError, ReferentialIntegrityError, NotFoundError } from '../errors/ApplicationError';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service de Questão
 * INV-BKD-11: Lógica de domínio centralizada no service
 */
export class QuestaoService {
  /**
   * Criar nova questão com validações
   * INV-QST-01: Questão DEVE ter enunciado não vazio
   * INV-QST-02: Questão DEVE ter pelo menos 5 alternativas
   * INV-QST-03: Pelo menos uma alternativa DEVE ter isCorreta = true
   */
  async criar(
    enunciado: string,
    alternativas: Alternativa[]
  ): Promise<Questao> {
    if (!enunciado || enunciado.trim().length === 0) {
      throw new ValidationError('Enunciado não pode estar vazio', { enunciado });
    }

    if (alternativas.length < 5) {
      throw new ValidationError('Questão deve ter pelo menos 5 alternativas', {
        fornecidas: alternativas.length,
      });
    }

    const temAlternativaCorreta = alternativas.some((alt) => alt.isCorreta);
    if (!temAlternativaCorreta) {
      throw new ValidationError('Pelo menos uma alternativa deve estar marcada como correta');
    }

    // Atribuir IDs às alternativas
    const alternativasComIds = alternativas.map((alt) => ({
      ...alt,
      id: uuidv4(),
    }));

    return questaoRepository.criar({
      enunciado,
      alternativas: alternativasComIds,
    });
  }

  /**
   * Buscar questão por ID
   */
  async buscarPorId(id: string): Promise<Questao> {
    const questao = await questaoRepository.buscarPorId(id);
    if (!questao) {
      throw new NotFoundError('Questão', id);
    }
    return questao;
  }

  /**
   * Listar todas as questões
   */
  async listarTodas(): Promise<Questao[]> {
    return questaoRepository.listarTodas();
  }

  /**
   * Atualizar questão
   */
  async atualizar(
    id: string,
    enunciado?: string,
    alternativas?: Alternativa[]
  ): Promise<Questao> {
    const questao = await this.buscarPorId(id);

    if (enunciado !== undefined && enunciado.trim().length === 0) {
      throw new ValidationError('Enunciado não pode estar vazio');
    }

    if (alternativas !== undefined && alternativas.length < 5) {
      throw new ValidationError('Questão deve ter pelo menos 5 alternativas', {
        fornecidas: alternativas.length,
      });
    }

    const atualizacoes: Partial<Questao> = {};
    if (enunciado !== undefined) atualizacoes.enunciado = enunciado;
    if (alternativas !== undefined) {
      const temAlternativaCorreta = alternativas.some((alt) => alt.isCorreta);
      if (!temAlternativaCorreta) {
        throw new ValidationError('Pelo menos uma alternativa deve estar marcada como correta');
      }
      const alternativasComIds = alternativas.map((alt) => ({
        ...alt,
        id: alt.id || uuidv4(),
      }));
      atualizacoes.alternativas = alternativasComIds;
    }

    const questaoAtualizada = await questaoRepository.atualizar(id, atualizacoes);
    if (!questaoAtualizada) {
      throw new NotFoundError('Questão', id);
    }
    return questaoAtualizada;
  }

  /**
   * Excluir questão
   * INV-QST-04: Excluir questão referenciada por Prova DEVE ser bloqueado
   */
  async excluir(id: string): Promise<void> {
    const questao = await this.buscarPorId(id);

    const estaVinculada = await provaRepository.questaoEstaVinculada(id);
    if (estaVinculada) {
      throw new ReferentialIntegrityError(
        `Questão '${questao.enunciado}' está vinculada a uma ou mais provas. Exclua as provas primeiro.`,
        { questaoId: id }
      );
    }

    await questaoRepository.excluir(id);
  }

  /**
   * Buscar questões por IDs (para prova)
   */
  async buscarPorIds(ids: string[]): Promise<Questao[]> {
    if (ids.length < 5) {
      throw new ValidationError('Prova deve ter pelo menos 5 questões', {
        fornecidas: ids.length,
      });
    }

    const questoes = await questaoRepository.buscarPorIds(ids);
    if (questoes.length !== ids.length) {
      throw new NotFoundError('Uma ou mais questões', 'não encontradas');
    }

    return questoes;
  }
}

export default new QuestaoService();
