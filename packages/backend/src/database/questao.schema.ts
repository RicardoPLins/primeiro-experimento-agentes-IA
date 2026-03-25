import mongoose, { Schema } from 'mongoose';
import { Questao, Alternativa } from '@gerenciador-provas/shared';

/**
 * Schema MongoDB para Questao
 * INV-BKD-04: Cada documento tem _id (ObjectId interno) + id (UUID público)
 */
const AlternativaSchema = new Schema<Alternativa>(
  {
    id: { type: String, required: true },
    descricao: { type: String, required: true },
    isCorreta: { type: Boolean, required: true },
  },
  { _id: false }
);

const QuestaoSchema = new Schema<Questao>(
  {
    id: { type: String, required: true, unique: true, index: true },
    enunciado: { type: String, required: true },
    alternativas: [AlternativaSchema],
    tipoIdentificacao: { type: String, enum: ['LETRAS', 'POTENCIAS_DE_2'], default: 'LETRAS' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const QuestaoModel = mongoose.model<Questao>('Questao', QuestaoSchema);
