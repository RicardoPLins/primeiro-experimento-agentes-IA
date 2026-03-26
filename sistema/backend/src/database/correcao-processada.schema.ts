import mongoose, { Schema } from 'mongoose';

/**
 * Schema para Correções Processadas (lotes de correção)
 * Armazena os resultados completos de uma correção em lote
 */
export interface CorrecaoProcessada {
  id: string;
  nomeLote: string;
  dataProcessamento: Date;
  modoCorrecao: string;
  totalAlunos: number;
  mediaGeral: number;
  notaMaxima: number;
  notaMinima: number;
  relatorios: Array<{
    nome: string;
    cpf: string;
    notaFinal: number;
    modo: string;
    acertos: number;
    totalQuestoes: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CorrecaoProcessadaSchema = new Schema<CorrecaoProcessada>(
  {
    id: { type: String, required: true, unique: true, index: true },
    nomeLote: { type: String, required: true, index: true },
    dataProcessamento: { type: Date, required: true, index: true },
    modoCorrecao: { type: String, required: true },
    totalAlunos: { type: Number, required: true },
    mediaGeral: { type: Number, required: true },
    notaMaxima: { type: Number, required: true },
    notaMinima: { type: Number, required: true },
    relatorios: [
      {
        nome: { type: String, required: true },
        cpf: { type: String, required: true },
        notaFinal: { type: Number, required: true },
        modo: { type: String, required: true },
        acertos: { type: Number, required: true },
        totalQuestoes: { type: Number, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CorrecaoProcessadaModel = mongoose.model<CorrecaoProcessada>(
  'CorrecaoProcessada',
  CorrecaoProcessadaSchema
);
