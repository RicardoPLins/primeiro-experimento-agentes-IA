import PDFDocument from 'pdfkit';
import { Prova, ProvaIndividual } from '@gerenciador-provas/shared';
import provaRepository from '../repositories/prova.repository';
import provaIndividualRepository from '../repositories/prova-individual.repository';
import gabaritoRepository from '../repositories/gabarito.repository';
import { NotFoundError } from '../errors/ApplicationError';

/**
 * Service para geração de PDFs e CSVs de provas individuais
 */
export class RelatorioProvaService {
  /**
   * Gerar PDF de uma prova individual
   */
  async gerarPDFProvaIndividual(
    provaIndividualId: string
  ): Promise<Buffer> {
    try {
      console.log(`[RelatorioProvaService.gerarPDFProvaIndividual] Gerando PDF ${provaIndividualId}`);

      // Buscar dados
      const provaIndividual = await provaIndividualRepository.buscarPorId(provaIndividualId);
      if (!provaIndividual) {
        throw new NotFoundError('Prova Individual', provaIndividualId);
      }

      const prova = await provaRepository.buscarPorId(provaIndividual.provaId);
      if (!prova) {
        throw new NotFoundError('Prova', provaIndividual.provaId);
      }

      // Criar PDF
      return new Promise((resolve, reject) => {
        try {
          const doc = new PDFDocument();
          const chunks: Buffer[] = [];

          doc.on('data', (chunk: Buffer) => chunks.push(chunk));
          doc.on('end', () => resolve(Buffer.concat(chunks)));
          doc.on('error', reject);

          // Cabeçalho
          this.adicionarCabecalho(doc, prova);

          // Conteúdo
          this.adicionarConteudo(doc, prova, provaIndividual);

          // Rodapé e espaço para nome/CPF
          this.adicionarRodapeEEspaco(doc, provaIndividual.numero);

          doc.end();
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      throw error;
    }
  }

  /**
   * Adicionar cabeçalho da prova ao PDF
   */
  private adicionarCabecalho(doc: any, prova: Prova): void {
    doc.fontSize(20).font('Helvetica-Bold').text(prova.nome, { align: 'center' });
    doc.fontSize(12).font('Helvetica').moveDown(0.5);

    const cabecalho = [
      `Disciplina: ${prova.disciplina}`,
      `Professor: ${prova.professor}`,
      `Turma: ${prova.turma}`,
      `Data: ${new Date(prova.data).toLocaleDateString('pt-BR')}`,
    ];

    cabecalho.forEach((linha) => {
      doc.fontSize(11).text(linha, { align: 'left' });
    });

    doc.moveDown(1);
    doc.strokeColor('#000').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
  }

  /**
   * Adicionar conteúdo das questões ao PDF
   * Mostra as questões e alternativas na ordem embaralhada
   */
  private adicionarConteudo(
    doc: any,
    prova: Prova,
    provaIndividual: ProvaIndividual
  ): void {
    const potenciasde2 = [1, 2, 4, 8, 16];

    provaIndividual.questoesEmbaralhadas.forEach((questaoEmbaralhada, idx) => {
      // Buscar questão original
      const questao = prova.questoes.find((q) => q.id === questaoEmbaralhada.questaoId);
      if (!questao) return;

      // Questão
      doc.fontSize(12).font('Helvetica-Bold').text(`${idx + 1}. ${questao.enunciado}`);
      doc.moveDown(0.3);

      // Alternativas na ordem embaralhada
      questaoEmbaralhada.alternativasEmbaralhadas.forEach((indiceOriginal, altIdx) => {
        const idx_num = parseInt(indiceOriginal);
        const alt = questao.alternativas[idx_num];
        
        // Usar letras ou potências de 2 baseado no tipo de identificação
        const identificador = questao.tipoIdentificacao === 'POTENCIAS_DE_2' 
          ? String(potenciasde2[altIdx]) 
          : String.fromCharCode(65 + altIdx);

        doc.fontSize(11).font('Helvetica').text(`${identificador}) ${alt.descricao}`);
      });

      doc.moveDown(0.5);

      // Espaço para resposta do aluno
      doc.strokeColor('#ccc').lineWidth(0.5).moveTo(100, doc.y).lineTo(500, doc.y).stroke();
      doc.moveDown(0.3);

      // Verificar se precisa nova página
      if (doc.y > 700) {
        doc.addPage();
        // Rodapé com número da prova
        doc.fontSize(9).text(`Prova ${provaIndividual.numero}`, 50, doc.page.height - 30);
      }
    });
  }

  /**
   * Adicionar rodapé e espaço para nome/CPF
   */
  private adicionarRodapeEEspaco(doc: any, numeroProva: number): void {
    // Nova página para a seção de respostas do aluno
    doc.addPage();

    doc.fontSize(14).font('Helvetica-Bold').text('Informações do Aluno', { align: 'center' });
    doc.moveDown(1);

    // Espaço para Nome
    doc.fontSize(11).text('Nome: ________________________________________________________');
    doc.moveDown(1.5);

    // Espaço para CPF
    doc.fontSize(11).text('CPF: ________________________________________________________');
    doc.moveDown(2);

    // Rodapé
    doc.fontSize(9).text(`Prova ${numeroProva}`, 50, doc.page.height - 30, { align: 'left' });
  }

  /**
   * Gerar CSV com gabaritos de todas as provas
   */
  async gerarCSVGabarito(provaId: string): Promise<string> {
    try {
      console.log(`[RelatorioProvaService.gerarCSVGabarito] Gerando CSV para ${provaId}`);

      // Buscar provas individuais
      const provasIndividuais = await provaIndividualRepository.listarPorProva(provaId);

      if (provasIndividuais.length === 0) {
        console.warn('[RelatorioProvaService.gerarCSVGabarito] ❌ Nenhuma prova individual encontrada');
        throw new Error('Nenhuma prova individual encontrada');
      }

      console.log(`[RelatorioProvaService.gerarCSVGabarito] ✅ Encontradas ${provasIndividuais.length} provas individuais`);

      // Cabeçalho
      const questoesCount = provasIndividuais[0].questoesEmbaralhadas.length;
      const colunas = ['Prova'];
      for (let i = 1; i <= questoesCount; i++) {
        colunas.push(`Q${i}`);
      }

      const linhas: string[] = [colunas.join(',')];

      // Dados de cada prova
      let gabaritoCount = 0;
      for (const provaIndividual of provasIndividuais) {
        console.log(`[RelatorioProvaService.gerarCSVGabarito] 🔍 Buscando gabarito para prova individual ${provaIndividual.numero}`);
        console.log(`[RelatorioProvaService.gerarCSVGabarito]    provaIndividualId: ${provaIndividual.id}`);
        
        const gabarito = await gabaritoRepository.buscarPorProvaIndividual(provaIndividual.id);
        console.log(`[RelatorioProvaService.gerarCSVGabarito]    Resultado: ${gabarito ? 'ENCONTRADO' : 'NÃO ENCONTRADO'}`);
        
        if (!gabarito) {
          console.warn(`[RelatorioProvaService.gerarCSVGabarito] ⚠️  Gabarito NÃO encontrado para prova individual ${provaIndividual.numero}`);
          // Criar linha vazia se gabarito não existir
          const linhaVazia = [provaIndividual.numero.toString()];
          for (let i = 0; i < questoesCount; i++) {
            linhaVazia.push('');
          }
          linhas.push(linhaVazia.join(','));
          continue;
        }

        gabaritoCount++;
        
        console.log(`[RelatorioProvaService.gerarCSVGabarito] ✅ Gabarito encontrado`);
        console.log(`[RelatorioProvaService.gerarCSVGabarito]    ID: ${gabarito.id}`);
        console.log(`[RelatorioProvaService.gerarCSVGabarito]    respostas array: [${gabarito.respostas.join(', ')}]`);
        console.log(`[RelatorioProvaService.gerarCSVGabarito]    respostas length: ${gabarito.respostas.length}`);

        const linha = [provaIndividual.numero.toString()];
        
        // Adicionar respostas (uma coluna por resposta)
        if (gabarito.respostas && gabarito.respostas.length > 0) {
          linha.push(...gabarito.respostas);
          console.log(`[RelatorioProvaService.gerarCSVGabarito] 📝 Linha montada: [${linha.join(', ')}]`);
        } else {
          // Se vazio, adicionar células vazias
          console.warn(`[RelatorioProvaService.gerarCSVGabarito] ⚠️  respostas array vazio!`);
          for (let i = 0; i < questoesCount; i++) {
            linha.push('');
          }
        }
        
        linhas.push(linha.join(','));
      }

      console.log(`[RelatorioProvaService.gerarCSVGabarito] ✅ CSV final: ${gabaritoCount} gabaritos processados, ${linhas.length} linhas totais`);

      const csvFinal = linhas.join('\n');
      console.log(`[RelatorioProvaService.gerarCSVGabarito] CSV gerado (${csvFinal.length} bytes):\n${csvFinal}`);

      return csvFinal;
    } catch (error) {
      console.error('❌ Erro ao gerar CSV:', error);
      throw error;
    }
  }

  /**
   * Gerar todos os PDFs de uma prova
   */
  async gerarTodosPDFs(provaId: string): Promise<Buffer[]> {
    const provasIndividuais = await provaIndividualRepository.listarPorProva(provaId);
    const pdfs: Buffer[] = [];

    for (const provaIndividual of provasIndividuais) {
      const pdf = await this.gerarPDFProvaIndividual(provaIndividual.id);
      pdfs.push(pdf);
    }

    return pdfs;
  }
}

export default new RelatorioProvaService();
