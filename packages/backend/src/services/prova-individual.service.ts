import { ProvaIndividual, QuestaoEmbaralhada, Prova } from '@gerenciador-provas/shared';
import provaRepository from '../repositories/prova.repository';
import provaIndividualRepository from '../repositories/prova-individual.repository';
import gabaritoRepository from '../repositories/gabarito.repository';
import { ValidationError, NotFoundError } from '../errors/ApplicationError';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service para geração de Provas Individuais com embaralhamento
 * INV-BKD-06: Embaralhamento determinístico via seed para reprodutibilidade
 */
export class ProvaIndividualService {
  /**
   * Embaralhar array usando Fisher-Yates com seed
   */
  private seededShuffle<T>(array: T[], seed: number): T[] {
    const result = [...array];
    let m = result.length;
    while (m) {
      // Gerar número pseudo-aleatório baseado em seed
      seed = (seed * 9301 + 49297) % 233280;
      const i = Math.floor((seed / 233280) * m--);
      [result[m], result[i]] = [result[i], result[m]];
    }
    return result;
  }

  /**
   * Gerar múltiplas provas individuais com questões e alternativas embaralhadas
   * INV-PRV-03: Cada prova individual tem ordem diferente de questões e alternativas
   */
  async gerarProvasIndividuais(
    provaId: string,
    quantidade: number
  ): Promise<ProvaIndividual[]> {
    try {
      console.log(`[ProvaIndividualService.gerarProvasIndividuais] Gerando ${quantidade} provas de ${provaId}`);

      // Verificar se prova existe
      const prova = await provaRepository.buscarPorId(provaId);
      if (!prova) {
        throw new NotFoundError('Prova', provaId);
      }

      if (quantidade < 1 || quantidade > 1000) {
        throw new ValidationError('Quantidade deve estar entre 1 e 1000', { quantidade });
      }

      const provasIndividuais: ProvaIndividual[] = [];

      // Gerar cada prova individual
      for (let i = 1; i <= quantidade; i++) {
        const seed = Date.now() + i;
        const provaIndividual = await this.gerarProvaIndividual(prova, i, seed);
        provasIndividuais.push(provaIndividual);
      }

      console.log(`✅ ${quantidade} provas individuais geradas para ${provaId}`);
      return provasIndividuais;
    } catch (error) {
      console.error('❌ Erro ao gerar provas individuais:', error);
      throw error;
    }
  }

  /**
   * Gerar uma prova individual com embaralhamento
   */
  private async gerarProvaIndividual(
    prova: Prova,
    numero: number,
    seed: number
  ): Promise<ProvaIndividual> {
    // Embaralhar questões
    const questoesEmbaralhadas = this.seededShuffle(prova.questoes, seed);

    // Embaralhar alternativas de cada questão
    const questoesProcessadas: QuestaoEmbaralhada[] = [];
    let seedLocal = seed;

    for (let i = 0; i < questoesEmbaralhadas.length; i++) {
      const questao = questoesEmbaralhadas[i];
      seedLocal = (seedLocal * 9301 + 49297) % 233280;

      // Criar mapa de alternativas originais com índices
      const alternativasComIndices = questao.alternativas.map((alt, idx) => ({
        descricao: alt.descricao,
        isCorreta: alt.isCorreta,
        indiceOriginal: idx,
      }));

      // Embaralhar
      const alternativasEmbaralhadas = this.seededShuffle(alternativasComIndices, seedLocal);

      questoesProcessadas.push({
        posicao: i,
        questaoId: questao.id,
        alternativasEmbaralhadas: alternativasEmbaralhadas.map((alt) => `${alt.indiceOriginal}`),
      });
    }

    const provaIndividualId = uuidv4();
    const provaIndividual: ProvaIndividual = {
      id: provaIndividualId,
      provaId: prova.id,
      numero,
      questoesEmbaralhadas: questoesProcessadas,
      sementes: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Salvar prova individual
    await provaIndividualRepository.criar(provaIndividual);

    // Gerar e salvar gabarito
    await this.gerarGabarito(provaIndividual, prova, numero);

    return provaIndividual;
  }

  /**
   * Gerar gabarito para uma prova individual
   */
  private async gerarGabarito(
    provaIndividual: ProvaIndividual,
    prova: Prova,
    numero: number
  ): Promise<void> {
    const respostas: string[] = [];

    for (const questaoEmbaralhada of provaIndividual.questoesEmbaralhadas) {
      // Buscar questão original
      const questao = prova.questoes.find((q) => q.id === questaoEmbaralhada.questaoId);
      if (!questao) continue;

      // Encontrar resposta correta na ordem original
      const indiceCorreto = questao.alternativas.findIndex((alt) => alt.isCorreta);
      if (indiceCorreto === -1) continue;

      // Encontrar novo índice após embaralhamento
      const novoIndice = questaoEmbaralhada.alternativasEmbaralhadas.indexOf(`${indiceCorreto}`);
      const letra = String.fromCharCode(65 + novoIndice);

      respostas.push(letra);
    }

    const gabarito = {
      id: uuidv4(),
      provaIndividualId: provaIndividual.id,
      numero,
      respostas,
      modo: prova.identificacao,
    };

    await gabaritoRepository.criar(gabarito);
  }

  /**
   * Buscar prova individual por ID
   */
  async buscarPorId(id: string): Promise<ProvaIndividual> {
    const provaIndividual = await provaIndividualRepository.buscarPorId(id);
    if (!provaIndividual) {
      throw new NotFoundError('Prova Individual', id);
    }
    return provaIndividual;
  }

  /**
   * Listar provas individuais de uma prova
   */
  async listarPorProva(provaId: string): Promise<ProvaIndividual[]> {
    console.log(`[ProvaIndividualService.listarPorProva] Listando provas de ${provaId}`);
    return provaIndividualRepository.listarPorProva(provaId);
  }

  /**
   * Excluir provas individuais de uma prova
   */
  async excluirPorProva(provaId: string): Promise<number> {
    console.log(`[ProvaIndividualService.excluirPorProva] Excluindo provas de ${provaId}`);
    return provaIndividualRepository.excluirPorProva(provaId);
  }
}

export default new ProvaIndividualService();
