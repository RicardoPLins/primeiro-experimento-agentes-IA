import { Prova, Identificacao } from '@gerenciador-provas/shared';
import provaRepository from '../repositories/prova.repository';
import questaoService from './questao.service';
import { ValidationError, NotFoundError } from '../errors/ApplicationError';

/**
 * Service de Prova com validações completas
 * INV-BKD-12: Lógica de prova template centralizada
 */
export class ProvaService {
  /**
   * Validar campos obrigatórios de prova
   */
  private validateProvaFields(
    nome?: string,
    disciplina?: string,
    professor?: string,
    turma?: string,
    data?: Date
  ): void {
    if (nome !== undefined && (!nome || nome.trim().length === 0)) {
      throw new ValidationError('Nome da prova não pode estar vazio', { nome });
    }

    if (disciplina !== undefined && (!disciplina || disciplina.trim().length === 0)) {
      throw new ValidationError('Disciplina não pode estar vazia', { disciplina });
    }

    if (professor !== undefined && (!professor || professor.trim().length === 0)) {
      throw new ValidationError('Professor não pode estar vazio', { professor });
    }

    if (turma !== undefined && (!turma || turma.trim().length === 0)) {
      throw new ValidationError('Turma não pode estar vazia', { turma });
    }

    if (data !== undefined && (!data || !(data instanceof Date) || isNaN(data.getTime()))) {
      throw new ValidationError('Data inválida', { data });
    }
  }

  /**
   * Validar identificação
   */
  private validateIdentificacao(identificacao: string): void {
    if (!['LETRAS', 'POTENCIAS_DE_2'].includes(identificacao)) {
      throw new ValidationError('Identificação inválida', { identificacao });
    }
  }

  /**
   * Validar questoesIds
   */
  private validateQuestoesIds(questoesIds: any): void {
    if (!questoesIds || !Array.isArray(questoesIds)) {
      throw new ValidationError('questoesIds deve ser um array', { questoesIds });
    }

    if (questoesIds.length !== 5) {
      throw new ValidationError('Prova deve ter exatamente 5 questões', {
        fornecidas: questoesIds.length,
      });
    }

    if (!questoesIds.every((id) => typeof id === 'string')) {
      throw new ValidationError('Todos os questoesIds devem ser strings', {
        questoesIds,
      });
    }
  }

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
    try {
      console.log('[ProvaService.criar] Iniciando criação de prova', { nome, identificacao });

      // Validações
      this.validateProvaFields(nome, disciplina, professor, turma, data);
      this.validateIdentificacao(identificacao);
      this.validateQuestoesIds(questoesIds);

      // Buscar questões
      console.log('[ProvaService.criar] Buscando questões...');
      const questoes = await questaoService.buscarPorIds(questoesIds);

      if (questoes.length !== 5) {
        throw new ValidationError('Nem todas as questões foram encontradas', {
          solicitadas: questoesIds.length,
          encontradas: questoes.length,
        });
      }

      // Salvar prova
      console.log('[ProvaService.criar] Salvando prova no repositório...');
      const prova = await provaRepository.criar({
        nome,
        disciplina,
        professor,
        data,
        turma,
        identificacao,
        questoes,
      });

      console.log(`✅ Prova criada: ${prova.id}`);
      return prova;
    } catch (error) {
      console.error('❌ Erro ao criar prova:', error);
      throw error;
    }
  }

  /**
   * Buscar prova por ID
   */
  async buscarPorId(id: string): Promise<Prova> {
    try {
      console.log('[ProvaService.buscarPorId] Buscando prova:', id);
      const prova = await provaRepository.buscarPorId(id);

      if (!prova) {
        throw new NotFoundError('Prova', id);
      }

      return prova;
    } catch (error) {
      console.error('❌ Erro ao buscar prova:', error);
      throw error;
    }
  }

  /**
   * Listar todas as provas
   */
  async listarTodas(): Promise<Prova[]> {
    try {
      console.log('[ProvaService.listarTodas] Buscando todas as provas');
      return provaRepository.listarTodas();
    } catch (error) {
      console.error('❌ Erro ao listar provas:', error);
      throw error;
    }
  }

  /**
   * Listar provas com paginação
   */
  async listarComPaginacao(
    pagina: number = 1,
    tamanho: number = 20
  ): Promise<{ provas: Prova[]; total: number }> {
    try {
      console.log('[ProvaService.listarComPaginacao] Página:', pagina, 'Tamanho:', tamanho);
      const provas = await provaRepository.listarTodas();
      const total = provas.length;
      const inicio = (pagina - 1) * tamanho;
      const fim = inicio + tamanho;

      return {
        provas: provas.slice(inicio, fim),
        total,
      };
    } catch (error) {
      console.error('❌ Erro ao listar provas com paginação:', error);
      throw error;
    }
  }

  /**
   * Atualizar prova
   */
  async atualizar(
    id: string,
    atualizacoes: Partial<Prova> & { questoesIds?: string[] }
  ): Promise<Prova> {
    try {
      console.log('[ProvaService.atualizar] Atualizando prova:', id);

      // Verificar se prova existe
      await this.buscarPorId(id);

      // Validar campos fornecidos
      if (atualizacoes.nome !== undefined || atualizacoes.disciplina !== undefined ||
          atualizacoes.professor !== undefined || atualizacoes.turma !== undefined ||
          atualizacoes.data !== undefined) {
        this.validateProvaFields(
          atualizacoes.nome,
          atualizacoes.disciplina,
          atualizacoes.professor,
          atualizacoes.turma,
          atualizacoes.data
        );
      }

      // Se identificacao foi fornecida, validar
      if (atualizacoes.identificacao) {
        this.validateIdentificacao(atualizacoes.identificacao);
      }

      // Se questoesIds foi fornecido, converter para questoes
      if (atualizacoes.questoesIds) {
        this.validateQuestoesIds(atualizacoes.questoesIds);
        const questoes = await questaoService.buscarPorIds(atualizacoes.questoesIds);
        atualizacoes.questoes = questoes;
        delete (atualizacoes as any).questoesIds;
      }

      const provaAtualizada = await provaRepository.atualizar(id, atualizacoes);

      if (!provaAtualizada) {
        throw new NotFoundError('Prova', id);
      }

      console.log(`✅ Prova atualizada: ${id}`);
      return provaAtualizada;
    } catch (error) {
      console.error('❌ Erro ao atualizar prova:', error);
      throw error;
    }
  }

  /**
   * Adicionar questão à prova
   */
  async adicionarQuestao(provaId: string, questaoId: string): Promise<void> {
    try {
      console.log('[ProvaService.adicionarQuestao] Prova:', provaId, 'Questão:', questaoId);

      // Buscar prova e questão
      const [prova, questao] = await Promise.all([
        this.buscarPorId(provaId),
        questaoService.buscarPorId(questaoId),
      ]);

      // Validar que a questão já não está na prova
      if (prova.questoes.some((q) => q.id === questaoId)) {
        throw new ValidationError('Questão já foi adicionada a esta prova', { questaoId });
      }

      // Validar limite de 5 questões
      if (prova.questoes.length >= 5) {
        throw new ValidationError('Prova já tem 5 questões (limite máximo)', {
          quantidade: prova.questoes.length,
        });
      }

      // Adicionar questão
      const novasQuestoes = [...prova.questoes, questao];
      await provaRepository.atualizar(provaId, { questoes: novasQuestoes });

      console.log(`✅ Questão ${questaoId} adicionada à prova ${provaId}`);
    } catch (error) {
      console.error('❌ Erro ao adicionar questão:', error);
      throw error;
    }
  }

  /**
   * Remover questão da prova
   */
  async removerQuestao(provaId: string, questaoId: string): Promise<void> {
    try {
      console.log('[ProvaService.removerQuestao] Prova:', provaId, 'Questão:', questaoId);

      const prova = await this.buscarPorId(provaId);

      // Remover questão
      const novasQuestoes = prova.questoes.filter((q) => q.id !== questaoId);

      if (novasQuestoes.length === prova.questoes.length) {
        throw new NotFoundError('Questão', questaoId);
      }

      await provaRepository.atualizar(provaId, { questoes: novasQuestoes });

      console.log(`✅ Questão ${questaoId} removida da prova ${provaId}`);
    } catch (error) {
      console.error('❌ Erro ao remover questão:', error);
      throw error;
    }
  }

  /**
   * Excluir prova
   */
  async excluir(id: string): Promise<void> {
    try {
      console.log('[ProvaService.excluir] Excluindo prova:', id);

      await this.buscarPorId(id);
      await provaRepository.excluir(id);

      console.log(`✅ Prova ${id} excluída`);
    } catch (error) {
      console.error('❌ Erro ao excluir prova:', error);
      throw error;
    }
  }

  /**
   * Obter estatísticas de provas
   */
  async obterEstatisticas(): Promise<{
    totalProvas: number;
    porIdentificacao: { LETRAS: number; POTENCIAS_DE_2: number };
    totalQuestoes: number;
  }> {
    try {
      console.log('[ProvaService.obterEstatisticas] Calculando estatísticas');

      const provas = await provaRepository.listarTodas();

      const porIdentificacao = {
        LETRAS: provas.filter((p) => p.identificacao === 'LETRAS').length,
        POTENCIAS_DE_2: provas.filter((p) => p.identificacao === 'POTENCIAS_DE_2').length,
      };

      const totalQuestoes = provas.reduce((acc, p) => acc + (p.questoes?.length || 0), 0);

      return {
        totalProvas: provas.length,
        porIdentificacao,
        totalQuestoes,
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}

export default new ProvaService();
