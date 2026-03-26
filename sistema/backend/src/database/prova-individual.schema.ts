import mongoose, { Schema } from 'mongoose';
import { ProvaIndividual, QuestaoEmbaralhada } from '@gerenciador-provas/shared';

/**
 * Schema MongoDB para Prova Individual
 * INV-BKD-05: Permite múltiplas séries de provas individuais com mesmo número
 * Campo 'serie' identifica cada geração/lote de provas
 */
const QuestaoEmbaralhadaSchema = new Schema<QuestaoEmbaralhada>(
  {
    posicao: { type: Number, required: true },
    questaoId: { type: String, required: true, ref: 'Questao' },
    alternativasEmbaralhadas: [String],
  },
  { _id: false }
);

const ProvaIndividualSchema = new Schema<ProvaIndividual>(
  {
    id: { type: String, required: true, unique: true, index: true },
    provaId: { type: String, required: true, ref: 'Prova', index: true },
    numero: { type: Number, required: true },
    serie: { type: Number, required: true, default: 1 },
    questoesEmbaralhadas: [QuestaoEmbaralhadaSchema],
    sementes: { type: Map, of: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Índice composto para permitir múltiplas séries
ProvaIndividualSchema.index({ provaId: 1, numero: 1, serie: 1 }, { unique: true });

export const ProvaIndividualModel = mongoose.model<ProvaIndividual>(
  'ProvaIndividual',
  ProvaIndividualSchema
);
