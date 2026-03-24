import mongoose, { Schema } from 'mongoose';
import { Prova } from '@gerenciador-provas/shared';

/**
 * Schema MongoDB para Prova (template)
 */
const ProvaSchema = new Schema<Prova>(
  {
    id: { type: String, required: true, unique: true, index: true },
    nome: { type: String, required: true },
    disciplina: { type: String, required: true },
    professor: { type: String, required: true },
    data: { type: Date, required: true },
    turma: { type: String, required: true },
    identificacao: { type: String, enum: ['LETRAS', 'POTENCIAS_DE_2'], required: true },
    questoes: [{ type: String, ref: 'Questao' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ProvaModel = mongoose.model<Prova>('Prova', ProvaSchema);
