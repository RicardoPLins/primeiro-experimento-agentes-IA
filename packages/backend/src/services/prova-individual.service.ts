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

    console.log(`\n[gerarGabarito] ===== INICIANDO GERAÇÃO DO GABARITO =====`);
    console.log(`[gerarGabarito] Prova ${numero}`);
    console.log(`[gerarGabarito] Total de questões embaralhadas: ${provaIndividual.questoesEmbaralhadas.length}`);
    console.log(`[gerarGabarito] Prova tem ${prova.questoes.length} questões originais\n`);

    for (const questaoEmbaralhada of provaIndividual.questoesEmbaralhadas) {
      console.log(`\n[gerarGabarito] Processando questão: ${questaoEmbaralhada.questaoId}`);
      
      // Buscar questão original pelo ID
      const questao = prova.questoes.find((q) => q.id === questaoEmbaralhada.questaoId);
      if (!questao) {
        console.warn(`[gerarGabarito] ❌ Questão ${questaoEmbaralhada.questaoId} NÃO ENCONTRADA`);
        console.warn(`[gerarGabarito] IDs disponíveis: ${prova.questoes.map(q => q.id).join(', ')}`);
        continue;
      }

      console.log(`[gerarGabarito]   Enunciado: ${questao.enunciado}`);
      console.log(`[gerarGabarito]   Alternativas: ${questao.alternativas.length}`);

      // Encontrar qual alternativa é a correta na ordem ORIGINAL
      let indiceCorretoOriginal = -1;
      for (let i = 0; i < questao.alternativas.length; i++) {
        if (questao.alternativas[i].isCorreta) {
          indiceCorretoOriginal = i;
          break;
        }
      }

      if (indiceCorretoOriginal === -1) {
        console.warn(`[gerarGabarito]   ❌ Nenhuma alternativa correta encontrada`);
        continue;
      }

      console.log(`[gerarGabarito]   Índice correto original: ${indiceCorretoOriginal}`);
      console.log(`[gerarGabarito]   alternativasEmbaralhadas: [${questaoEmbaralhada.alternativasEmbaralhadas.join(', ')}]`);

      // Encontrar a posição do índice correto original no array embaralhado
      // alternativasEmbaralhadas contém os índices originais na nova ordem
      const posicaoNovoIndice = questaoEmbaralhada.alternativasEmbaralhadas.indexOf(
        `${indiceCorretoOriginal}`
      );

      if (posicaoNovoIndice === -1) {
        console.warn(`[gerarGabarito]   ❌ Índice correto ${indiceCorretoOriginal} NÃO ENCONTRADO`);
        continue;
      }

      // Converter para letra (0 -> A, 1 -> B, etc)
      const letra = String.fromCharCode(65 + posicaoNovoIndice);
      respostas.push(letra);

      console.log(
        `[gerarGabarito]   ✅ Resposta: ${letra} (posição ${posicaoNovoIndice})`
      );
    }

    console.log(`\n[gerarGabarito] FINAL: Prova ${numero} - Respostas: [${respostas.join(', ')}]`);

    if (respostas.length === 0) {
      console.warn(`[gerarGabarito] ⚠️  Gabarito VAZIO para prova ${numero}`);
    }

    const gabarito = {
      id: uuidv4(),
      provaIndividualId: provaIndividual.id,
      numero,
      respostas: respostas,
      modo: prova.identificacao || 'LETRAS',
    };

    console.log(`[gerarGabarito] 💾 Salvando gabarito: Prova ${numero}, Respostas: [${gabarito.respostas.join(',')}]`);
    const result = await gabaritoRepository.criar(gabarito);
    console.log(`[gerarGabarito] ✅ Gabarito salvo com sucesso. ID: ${result.id}`);
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
