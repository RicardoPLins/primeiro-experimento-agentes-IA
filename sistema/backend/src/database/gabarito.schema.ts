import mongoose, { Schema } from 'mongoose';
import { Gabarito } from '@gerenciador-provas/shared';

/**
 * Schema MongoDB para Gabarito
 */
const GabaritoSchema = new Schema<Gabarito>(
  {
    id: { type: String, required: true, unique: true, index: true },
    provaIndividualId: { type: String, required: true, ref: 'ProvaIndividual', index: true },
    numero: { type: Number, required: true },
    respostas: [String],
    modo: { type: String, enum: ['LETRAS', 'POTENCIAS_DE_2'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const GabaritoModel = mongoose.model<Gabarito>('Gabarito', GabaritoSchema);
