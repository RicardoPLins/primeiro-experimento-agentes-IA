import { 
  RelatorioNotas,
  ModoCorrecao,
} from '@gerenciador-provas/shared';
import { ValidationError } from '../errors/ApplicationError';

/**
 * Service para correção de provas - Comparação genérica de CSVs
 */
export class CorrecaoService {
  /**
   * Comparar duas respostas - modo RIGOROSA (tudo ou nada)
   */
  private compararRespostasRigorosa(resposta: string, gabarito: string): boolean {
    return resposta.trim().toUpperCase() === gabarito.trim().toUpperCase();
  }

  /**
   * Comparar duas respostas - modo MENOS_RIGOROSA (aceita similar)
   */
  private compararRespostasFlexivel(resposta: string, gabarito: string): boolean {
    const r = resposta.trim().toUpperCase();
    const g = gabarito.trim().toUpperCase();
    
    // Aceita se for igual ou similar (primeira letra igual)
    return r === g || r.charAt(0) === g.charAt(0);
  }

  /**
   * Parser simples para CSV de Gabarito
   * Formato: Prova,Q1,Q2,Q3,Q4,Q5
   *          1,E,C,D,E,C
   */
  private parseCSVGabaritoSimples(conteudoCSV: string): Map<string, string[]> {
    try {
      const linhas = conteudoCSV.trim().split('\n');
      if (linhas.length < 2) {
        throw new ValidationError('CSV de gabarito vazio ou inválido', {});
      }

      const gabaritos = new Map<string, string[]>();

      // Pular cabeçalho (linha 0)
      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (!linha) continue;

        const partes = linha.split(',').map(p => p.trim());
        const numeroProva = partes[0]; // String: "1", "2", "3"

        if (!numeroProva) {
          console.warn(`[parseCSVGabaritoSimples] Linha ${i} sem número de prova`);
          continue;
        }

        // Respostas começam da coluna 1
        const respostas = partes.slice(1);
        gabaritos.set(numeroProva, respostas);
        console.log(`[parseCSVGabaritoSimples] Prova ${numeroProva}: ${respostas.join(',')}`);
      }

      console.log(`[parseCSVGabaritoSimples] ✅ Parseado gabarito com ${gabaritos.size} provas`);
      return gabaritos;
    } catch (error) {
      console.error('[parseCSVGabaritoSimples] Erro:', error);
      throw new ValidationError('Erro ao parsear CSV de gabarito', {
        erro: error instanceof Error ? error.message : 'Desconhecido',
      });
    }
  }

  /**
   * Parser simples para CSV de Respostas
   * Formato: Prova,Q1,Q2,Q3,Q4,Q5,Nome,CPF
   *          1,E,C,D,E,C,João Silva,12345678900
   */
  private parseCSVRespostasSimples(conteudoCSV: string): Array<{ prova: string; respostas: string[]; nome: string; cpf: string }> {
    try {
      const linhas = conteudoCSV.trim().split('\n');
      if (linhas.length < 2) {
        throw new ValidationError('CSV de respostas vazio ou inválido', {});
      }

      const respostas: Array<{ prova: string; respostas: string[]; nome: string; cpf: string }> = [];

      // Pular cabeçalho
      for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i].trim();
        if (!linha) continue;

        const partes = linha.split(',').map(p => p.trim());
        const numeroProva = partes[0];

        if (!numeroProva) {
          console.warn(`[parseCSVRespostasSimples] Linha ${i} sem número de prova`);
          continue;
        }

        // Os dois últimos campos são Nome e CPF
        const cpf = partes[partes.length - 1];
        const nome = partes[partes.length - 2];
        
        // Respostas são as colunas do meio (1 até antes do penúltimo)
        const respostasAluno = partes.slice(1, partes.length - 2);

        respostas.push({
          prova: numeroProva,
          respostas: respostasAluno,
          nome: nome || 'N/A',
          cpf: cpf || 'N/A',
        });
        console.log(`[parseCSVRespostasSimples] Prova ${numeroProva} - ${nome} (${cpf}): ${respostasAluno.join(',')}`);
      }

      console.log(`[parseCSVRespostasSimples] ✅ Parseado ${respostas.length} linhas`);
      return respostas;
    } catch (error) {
      console.error('[parseCSVRespostasSimples] Erro:', error);
      throw new ValidationError('Erro ao parsear CSV de respostas', {
        erro: error instanceof Error ? error.message : 'Desconhecido',
      });
    }
  }

  /**
   * Corrigir todas as provas - Comparação genérica
   * Entrada: gabarito CSV, respostas CSV, modo de correção
   * Saída: relatórios com porcentagem de acertos
   */
  async corrigirProvas(
    provaId: string,
    csvGabarito: string,
    csvRespostas: string,
    modoCorrecao: ModoCorrecao
  ): Promise<RelatorioNotas[]> {
    try {
      console.log(`\n[CorrecaoService.corrigirProvas] ===== INICIANDO CORREÇÃO GENÉRICA =====`);
      console.log(`[CorrecaoService.corrigirProvas] Modo: ${modoCorrecao}`);

      // 1. Parsear CSVs
      const gabaritos = this.parseCSVGabaritoSimples(csvGabarito);
      const respostasListas = this.parseCSVRespostasSimples(csvRespostas);

      console.log(`[CorrecaoService.corrigirProvas] ✅ CSVs parseados`);
      console.log(`   - Gabaritos: ${gabaritos.size}`);
      console.log(`   - Respostas: ${respostasListas.length}`);

      // 2. Corrigir cada linha de respostas
      const relatórios: RelatorioNotas[] = [];
      let index = 0;

      for (const respostaLinha of respostasListas) {
        try {
          const numeroProva = respostaLinha.prova;
          const gabaritoResposta = gabaritos.get(numeroProva);

          if (!gabaritoResposta) {
            console.warn(`[CorrecaoService.corrigirProvas] ⚠️ Gabarito não encontrado para prova ${numeroProva}`);
            continue;
          }

          // Comparar questão por questão
          let acertos = 0;
          const totalQuestoes = Math.min(respostaLinha.respostas.length, gabaritoResposta.length);

          for (let i = 0; i < totalQuestoes; i++) {
            const resposta = respostaLinha.respostas[i];
            const gabarito = gabaritoResposta[i];

            let acertou = false;
            if (modoCorrecao === 'RIGOROSA') {
              acertou = this.compararRespostasRigorosa(resposta, gabarito);
            } else {
              acertou = this.compararRespostasFlexivel(resposta, gabarito);
            }

            if (acertou) {
              acertos++;
            }

            console.log(`    Q${i + 1}: ${resposta} vs ${gabarito} = ${acertou ? '✅' : '❌'}`);
          }

          // Calcular porcentagem
          const porcentagem = totalQuestoes > 0 ? (acertos / totalQuestoes) * 100 : 0;

          const relatorio: RelatorioNotas = {
            id: `${provaId}-${numeroProva}-${index}`,
            email: `prova-${numeroProva}-${respostaLinha.cpf}`,
            nome: respostaLinha.nome,
            cpf: respostaLinha.cpf,
            notaFinal: parseFloat(porcentagem.toFixed(2)),
            notas: Array(totalQuestoes).fill(null).map((_, i) => ({
              questaoIndex: i,
              nota: respostaLinha.respostas[i] === gabaritoResposta[i] ? 1 : 0,
              peso: 1,
            })),
            modoCorrecao,
            createdAt: new Date(),
          };

          relatórios.push(relatorio);
          console.log(`✅ ${respostaLinha.nome} (Prova ${numeroProva}): ${acertos}/${totalQuestoes} acertos (${porcentagem.toFixed(2)}%)\n`);

          index++;
        } catch (error) {
          console.error(`[CorrecaoService.corrigirProvas] Erro ao corrigir linha:`, error);
          continue;
        }
      }

      console.log(`[CorrecaoService.corrigirProvas] ✅ Correção concluída - ${relatórios.length} provas corrigidas`);
      return relatórios;
    } catch (error) {
      console.error('[CorrecaoService.corrigirProvas] Erro fatal:', error);
      throw error;
    }
  }

  /**
   * Gerar relatório com curva de distribuição
   */
  async gerarRelatorioCurva(
    relatorios: RelatorioNotas[]
  ): Promise<{
    media: number;
    mediana: number;
    desvio: number;
    maximo: number;
    minimo: number;
  }> {
    if (relatorios.length === 0) {
      return { media: 0, mediana: 0, desvio: 0, maximo: 0, minimo: 0 };
    }

    const notas = relatorios.map((r) => r.notaFinal).sort((a, b) => a - b);

    // Média
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;

    // Mediana
    const mediana =
      notas.length % 2 === 0
        ? (notas[notas.length / 2 - 1] + notas[notas.length / 2]) / 2
        : notas[Math.floor(notas.length / 2)];

    // Desvio padrão
    const desvio = Math.sqrt(
      notas.reduce((sum, nota) => sum + Math.pow(nota - media, 2), 0) / notas.length
    );

    // Máximo e mínimo
    const maximo = Math.max(...notas);
    const minimo = Math.min(...notas);

    return {
      media: parseFloat(media.toFixed(2)),
      mediana: parseFloat(mediana.toFixed(2)),
      desvio: parseFloat(desvio.toFixed(2)),
      maximo: parseFloat(maximo.toFixed(2)),
      minimo: parseFloat(minimo.toFixed(2)),
    };
  }
  /**
   * Exportar relatórios para CSV
   */
  exportarCSV(relatorios: RelatorioNotas[]): string {
    const linhas = ['Email,Nome,Nota Final,Total Questões,Acertos'];

    for (const relatorio of relatorios) {
      const totalQuestoes = relatorio.notas.length;
      const acertos = relatorio.notas.filter((n) => n.nota > 0).length;

      linhas.push(
        `${relatorio.email},${relatorio.nome || 'N/A'},${relatorio.notaFinal},${totalQuestoes},${acertos}`
      );
    }

    return linhas.join('\n');
  }
}

const correcaoService = new CorrecaoService();
export default correcaoService;
