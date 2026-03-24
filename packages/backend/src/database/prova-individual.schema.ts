import mongoose, { Schema } from 'mongoose';
import { ProvaIndividual, QuestaoEmbaralhada } from '@gerenciador-provas/shared';

/**
 * Schema MongoDB para Prova Individual
 * INV-BKD-05: Índice composto (provaId, numero) para garantir unicidade
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
    questoesEmbaralhadas: [QuestaoEmbaralhadaSchema],
    sementes: { type: Map, of: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Índice composto para garantir apenas uma prova individual por prova/número
ProvaIndividualSchema.index({ provaId: 1, numero: 1 }, { unique: true });

export const ProvaIndividualModel = mongoose.model<ProvaIndividual>(
  'ProvaIndividual',
  ProvaIndividualSchema
);
