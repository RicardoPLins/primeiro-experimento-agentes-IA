/**
 * Tipos de domínio compartilhados entre frontend e backend
 * Definição única de verdade para todas as entidades do sistema
 */

export interface Alternativa {
  id: string;
  descricao: string;
  isCorreta: boolean;
}

export interface Questao {
  id: string;
  enunciado: string;
  alternativas: Alternativa[];
  tipoIdentificacao?: Identificacao;
  createdAt: Date;
  updatedAt: Date;
}

export type Identificacao = 'LETRAS' | 'POTENCIAS_DE_2';

export interface Prova {
  id: string;
  nome: string;
  disciplina: string;
  professor: string;
  data: Date;
  turma: string;
  identificacao: Identificacao;
  questoes: Questao[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProvaIndividual {
  id: string;
  provaId: string;
  numero: number;
  questoesEmbaralhadas: QuestaoEmbaralhada[];
  sementes: Record<number, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestaoEmbaralhada {
  posicao: number;
  questaoId: string;
  alternativasEmbaralhadas: string[];
}

export interface Gabarito {
  id: string;
  provaIndividualId: string;
  numero: number;
  respostas: string[];
  modo: Identificacao;
  createdAt: Date;
  updatedAt: Date;
}

export interface RespostaAluno {
  numeroProva: number;
  email: string;
  nome?: string;
  cpf?: string;
  respostas: string[];
  timestamp: Date;
}

export type ModoCorrecao = 'RIGOROSA' | 'MENOS_RIGOROSA';

export interface NotaQuestao {
  questaoIndex: number;
  nota: number;
  peso: number;
}

export interface RelatorioNotas {
  id: string;
  email: string;
  nome?: string;
  cpf?: string;
  notaFinal: number;
  notas: NotaQuestao[];
  modoCorrecao: ModoCorrecao;
  createdAt: Date;
}

export interface GabaritoCSV {
  numero_prova: number;
  respostas: string[];
}

export interface RespostasCSV {
  timestamp: string;
  email: string;
  numero_prova: number;
  [key: string]: string | number;
}

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}
