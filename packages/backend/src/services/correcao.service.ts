import { 
  Questao, 
  RelatorioNotas,
  NotaQuestao,
  ModoCorrecao,
  RespostaAluno,
} from '@gerenciador-provas/shared';
import { ValidationError, NotFoundError } from '../errors/ApplicationError';
import provaIndividualRepository from '../repositories/prova-individual.repository';
import relatorioNotasRepository from '../repositories/relatorio-notas.repository';
import provaRepository from '../repositories/prova.repository';

/**
 * Service para correção de provas
 * Implementa dois modos: RIGOROSA (tudo ou nada) e MENOS_RIGOROSA (proporcional)
 */
export class CorrecaoService {
  /**
   * Decomposição de potências de 2 - retorna array de potências
   * Exemplo: 13 = 8 + 4 + 1 = [1, 4, 8]
   */
  private decompor(numero: number): number[] {
    const potencias = [1, 2, 4, 8, 16];
    const resultado: number[] = [];
    
    for (const pot of potencias) {
      if (numero & pot) {
        resultado.push(pot);
      }
    }
    
    return resultado.sort((a, b) => a - b);
  }

  /**
   * Parser para CSV de Gabarito
   * Formato esperado: numero_prova, resposta_q1, resposta_q2, ...
   */
  parseCSVGabarito(conteudoCSV: string): Map<number, string[]> {
    try {
      const linhas = conteudoCSV.trim().split('\n');
      if (linhas.length < 2) {
        throw new ValidationError('CSV de gabarito vazio ou inválido', {});
      }

      const gabaritos = new Map<number, string[]>();

      // Pular cabeçalho
      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (!linha) continue;

        const partes = linha.split(',');
        const numeroProva = parseInt(partes[0].trim(), 10);

        if (isNaN(numeroProva)) {
          console.warn(`[parseCSVGabarito] Linha ${i} com número de prova inválido: ${partes[0]}`);
          continue;
        }

        // Respostas começam da coluna 1
        const respostas = partes.slice(1).map((r) => r.trim());
        gabaritos.set(numeroProva, respostas);
      }

      console.log(`[parseCSVGabarito] ✅ Parseado gabarito com ${gabaritos.size} provas`);
      return gabaritos;
    } catch (error) {
      console.error('[parseCSVGabarito] Erro:', error);
      throw new ValidationError('Erro ao parsear CSV de gabarito', {
        erro: error instanceof Error ? error.message : 'Desconhecido',
      });
    }
  }

  /**
   * Parser para CSV de Respostas
   * Formato: timestamp, email, numero_prova, resposta_q1, resposta_q2, ...
   */
  parseCSVRespostas(conteudoCSV: string): RespostaAluno[] {
    try {
      const linhas = conteudoCSV.trim().split('\n');
      if (linhas.length < 2) {
        throw new ValidationError('CSV de respostas vazio ou inválido', {});
      }

      const respostas: RespostaAluno[] = [];

      // Pular cabeçalho
      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (!linha) continue;

        const partes = linha.split(',');
        
        if (partes.length < 3) {
          console.warn(`[parseCSVRespostas] Linha ${i} com formato inválido`);
          continue;
        }

        const timestamp = new Date(partes[0].trim());
        const email = partes[1].trim();
        const numeroProva = parseInt(partes[2].trim(), 10);

        if (isNaN(numeroProva) || !email) {
          console.warn(`[parseCSVRespostas] Linha ${i} com dados inválidos`);
          continue;
        }

        // Respostas começam da coluna 3
        const respostasAluno = partes.slice(3).map((r) => r.trim());

        respostas.push({
          numeroProva,
          email,
          respostas: respostasAluno,
          timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
        });
      }

      console.log(`[parseCSVRespostas] ✅ Parseado ${respostas.length} alunos`);
      return respostas;
    } catch (error) {
      console.error('[parseCSVRespostas] Erro:', error);
      throw new ValidationError('Erro ao parsear CSV de respostas', {
        erro: error instanceof Error ? error.message : 'Desconhecido',
      });
    }
  }

  /**
   * Corrigir uma questão do tipo LETRAS
   * Modo RIGOROSA: deve ser exatamente igual
   * Modo MENOS_RIGOROSA: aceita a mesma resposta
   */
  private corrigirQuestaoLetra(
    respostaAluno: string,
    gabaritoResposta: string,
    modo: ModoCorrecao
  ): number {
    const respLimpaNormalizado = (respostaAluno || '').trim().toUpperCase();
    const gabLimpaNormalizado = (gabaritoResposta || '').trim().toUpperCase();

    if (modo === 'RIGOROSA') {
      return respLimpaNormalizado === gabLimpaNormalizado ? 1 : 0;
    } else {
      // MENOS_RIGOROSA: também exige igualdade para LETRAS
      return respLimpaNormalizado === gabLimpaNormalizado ? 1 : 0;
    }
  }

  /**
   * Corrigir uma questão do tipo POTENCIAS_DE_2
   * Modo RIGOROSA: todas as alternativas devem estar corretas (soma exata)
   * Modo MENOS_RIGOROSA: proporcional - conta alternativas corretas vs totais
   */
  private corrigirQuestaoPotencias(
    respostaAluno: string,
    gabaritoResposta: string,
    questao: Questao,
    modo: ModoCorrecao
  ): number {
    try {
      const respNumero = parseInt(respostaAluno?.trim() || '0', 10);
      const gabNumero = parseInt(gabaritoResposta?.trim() || '0', 10);

      if (isNaN(respNumero) || isNaN(gabNumero)) {
        return 0;
      }

      const alternativasCorretas = questao.alternativas.filter((a) => a.isCorreta).length;
      
      if (modo === 'RIGOROSA') {
        // Tudo ou nada - deve ser exatamente igual
        return respNumero === gabNumero ? 1 : 0;
      } else {
        // MENOS_RIGOROSA: proporcional
        const respDecomposta = this.decompor(respNumero);
        const gabDecomposta = this.decompor(gabNumero);

        // Contar acertos
        const acertos = respDecomposta.filter((p) => gabDecomposta.includes(p)).length;
        
        // Se não marcou nada e gabarito tb não tem
        if (acertos === 0 && gabNumero === 0 && respNumero === 0) {
          return 1;
        }

        // Se alternativas corretas > 0, calcula proporção
        if (alternativasCorretas > 0) {
          return acertos / alternativasCorretas;
        }

        // Fallback
        return respNumero === gabNumero ? 1 : 0;
      }
    } catch (error) {
      console.error('[corrigirQuestaoPotencias] Erro:', error);
      return 0;
    }
  }

  /**
   * Corrigir todas as respostas de um aluno
   */
  private corrigirAluno(
    respostasAluno: string[],
    gabarito: string[],
    prova: Questao[],
    modo: ModoCorrecao
  ): { notas: NotaQuestao[]; notaFinal: number } {
    const notas: NotaQuestao[] = [];
    let somaNotas = 0;

    const totalQuestoes = Math.min(respostasAluno.length, gabarito.length, prova.length);

    for (let i = 0; i < totalQuestoes; i++) {
      const questao = prova[i];
      const resposta = respostasAluno[i];
      const gabaritoQuestao = gabarito[i];

      let nota = 0;

      if (questao.tipoIdentificacao === 'LETRAS') {
        nota = this.corrigirQuestaoLetra(resposta, gabaritoQuestao, modo);
      } else {
        // POTENCIAS_DE_2
        nota = this.corrigirQuestaoPotencias(resposta, gabaritoQuestao, questao, modo);
      }

      notas.push({
        questaoIndex: i,
        nota,
        peso: 1, // Peso igual para todas
      });

      somaNotas += nota;
    }

    // Calcular nota final (0-10)
    const notaFinal = totalQuestoes > 0 ? (somaNotas / totalQuestoes) * 10 : 0;

    return {
      notas,
      notaFinal: Math.round(notaFinal * 100) / 100, // Arredondar para 2 casas decimais
    };
  }

  /**
   * Corrigir todas as provas
   * Entrada: gabarito CSV, respostas CSV, modo de correção
   * Saída: relatórios salvos no MongoDB
   */
  async corrigirProvas(
    provaId: string,
    csvGabarito: string,
    csvRespostas: string,
    modoCorrecao: ModoCorrecao
  ): Promise<RelatorioNotas[]> {
    try {
      console.log(`\n[CorrecaoService.corrigirProvas] ===== INICIANDO CORREÇÃO =====`);
      console.log(`[CorrecaoService.corrigirProvas] Prova: ${provaId}`);
      console.log(`[CorrecaoService.corrigirProvas] Modo: ${modoCorrecao}`);

      // 1. Validar prova existe
      const prova = await provaRepository.buscarPorId(provaId);
      if (!prova) {
        throw new NotFoundError('Prova', provaId);
      }

      console.log(`[CorrecaoService.corrigirProvas] ✅ Prova encontrada: ${prova.nome}`);

      // 2. Parsear CSVs
      const gabaritos = this.parseCSVGabarito(csvGabarito);
      const respostas = this.parseCSVRespostas(csvRespostas);

      console.log(`[CorrecaoService.corrigirProvas] ✅ CSVs parseados`);

      // 3. Agrupar respostas por email
      const respostasAgrupadas = new Map<string, RespostaAluno>();
      for (const resposta of respostas) {
        // Usar a última resposta do aluno se houver duplicatas
        respostasAgrupadas.set(resposta.email, resposta);
      }

      console.log(`[CorrecaoService.corrigirProvas] 👥 Total alunos únicos: ${respostasAgrupadas.size}`);

      // 4. Corrigir cada aluno
      const relatórios: RelatorioNotas[] = [];

      for (const [email, respostaAluno] of respostasAgrupadas) {
        try {
          const numeroProva = respostaAluno.numeroProva;
          const gabaritoResposta = gabaritos.get(numeroProva);

          if (!gabaritoResposta) {
            console.warn(`[CorrecaoService.corrigirProvas] ⚠️ Gabarito não encontrado para prova ${numeroProva}`);
            continue;
          }

          // Obter questões na ordem da prova individual
          const provaIndividual = await provaIndividualRepository.buscarPorProvaENumero(
            provaId,
            numeroProva
          );

          if (!provaIndividual) {
            console.warn(`[CorrecaoService.corrigirProvas] ⚠️ Prova individual ${numeroProva} não encontrada`);
            continue;
          }

          // Reconstruir ordem de questões
          const questoesOrdenadas: Questao[] = [];
          for (const questaoEmbaralhada of provaIndividual.questoesEmbaralhadas) {
            const questao = prova.questoes.find((q) => q.id === questaoEmbaralhada.questaoId);
            if (questao) {
              questoesOrdenadas.push(questao);
            }
          }

          // Corrigir
          const { notas, notaFinal } = this.corrigirAluno(
            respostaAluno.respostas,
            gabaritoResposta,
            questoesOrdenadas,
            modoCorrecao
          );

          // Salvar relatório
          const relatorio = await relatorioNotasRepository.criar({
            email,
            nome: respostaAluno.nome,
            cpf: respostaAluno.cpf,
            notaFinal,
            notas,
            modoCorrecao,
          });

          relatórios.push(relatorio);

          console.log(
            `[CorrecaoService.corrigirProvas] ✅ ${email}: ${notaFinal.toFixed(2)}/10`
          );
        } catch (error) {
          console.error(
            `[CorrecaoService.corrigirProvas] ❌ Erro ao corrigir ${email}:`,
            error
          );
          // Continuar com próximo aluno
        }
      }

      console.log(`[CorrecaoService.corrigirProvas] ✅ Correção concluída: ${relatórios.length} relatórios gerados\n`);

      return relatórios;
    } catch (error) {
      console.error('[CorrecaoService.corrigirProvas] Erro fatal:', error);
      throw error;
    }
  }

  /**
   * Gerar relatório da turma com estatísticas
   */
  async gerarRelatorioCurva(relatorios: RelatorioNotas[]): Promise<any> {
    if (relatorios.length === 0) {
      return {
        total: 0,
        mediaGeral: 0,
        maiorNota: 0,
        menorNota: 0,
        mediana: 0,
        desvio: 0,
      };
    }

    const notas = relatorios.map((r) => r.notaFinal);
    notas.sort((a, b) => a - b);

    const total = notas.length;
    const mediaGeral = notas.reduce((a, b) => a + b, 0) / total;
    const maiorNota = notas[total - 1];
    const menorNota = notas[0];
    const mediana =
      total % 2 === 0 ? (notas[total / 2 - 1] + notas[total / 2]) / 2 : notas[Math.floor(total / 2)];

    // Desvio padrão
    const variancia =
      notas.reduce((soma, nota) => soma + Math.pow(nota - mediaGeral, 2), 0) / total;
    const desvio = Math.sqrt(variancia);

    return {
      total,
      mediaGeral: Math.round(mediaGeral * 100) / 100,
      maiorNota,
      menorNota,
      mediana,
      desvio: Math.round(desvio * 100) / 100,
    };
  }

  /**
   * Exportar relatórios para CSV
   */
  async exportarCSV(relatorios: RelatorioNotas[]): Promise<string> {
    let csv = 'email,nome,cpf,notaFinal,modoCorrecao,createdAt\n';

    for (const rel of relatorios) {
      const linha = [
        rel.email,
        rel.nome || '',
        rel.cpf || '',
        rel.notaFinal,
        rel.modoCorrecao,
        rel.createdAt.toISOString(),
      ].join(',');

      csv += linha + '\n';
    }

    return csv;
  }
}

export default new CorrecaoService();
