import mongoose, { Schema } from 'mongoose';
import { RelatorioNotas, NotaQuestao } from '@gerenciador-provas/shared';

/**
 * Schema MongoDB para Relatório de Notas
 */
const NotaQuestaoSchema = new Schema<NotaQuestao>(
  {
    questaoIndex: { type: Number, required: true },
    nota: { type: Number, required: true },
    peso: { type: Number, required: true },
  },
  { _id: false }
);

const RelatorioNotasSchema = new Schema<RelatorioNotas>(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    nome: String,
    cpf: String,
    notaFinal: { type: Number, required: true },
    notas: [NotaQuestaoSchema],
    modoCorrecao: { type: String, enum: ['RIGOROSA', 'MENOS_RIGOROSA'], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const RelatorioNotasModel = mongoose.model<RelatorioNotas>(
  'RelatorioNotas',
  RelatorioNotasSchema
);
