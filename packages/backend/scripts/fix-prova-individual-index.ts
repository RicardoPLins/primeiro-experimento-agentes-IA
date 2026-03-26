/**
 * Script para corrigir índice de ProvaIndividual no MongoDB
 * Remove índice composto único (provaId, numero)
 * Recria índice composto único (provaId, numero, serie)
 */

import mongoose from 'mongoose';
import { ProvaIndividualModel } from '../src/database/prova-individual.schema';

async function fixIndex() {
  try {
    // Conectar ao MongoDB
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/gerenciador-provas';
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB');

    // Listar índices existentes
    console.log('\n📊 Índices existentes:');
    const indexes = await ProvaIndividualModel.collection.getIndexes();
    Object.entries(indexes).forEach(([key, index]) => {
      console.log(`  ${key}:`, index);
    });

    // Remover índice antigo se existir
    try {
      console.log('\n🔄 Tentando remover índice antigo (provaId_1_numero_1)...');
      await ProvaIndividualModel.collection.dropIndex('provaId_1_numero_1');
      console.log('✅ Índice antigo removido');
    } catch (err: any) {
      if (err.code === 27) {
        console.log('ℹ️  Índice antigo não encontrado (já removido)');
      } else {
        console.warn('⚠️  Erro ao remover índice:', err.message);
      }
    }

    // Recriar índices
    console.log('\n🔄 Recriando índices...');
    await ProvaIndividualModel.collection.dropIndexes().catch(() => {
      console.log('ℹ️  Sem índices para remover');
    });

    // Aplicar novo schema com índices corretos
    await ProvaIndividualModel.syncIndexes();
    console.log('✅ Índices recriados com sucesso');

    // Listar novos índices
    console.log('\n📊 Novos índices:');
    const newIndexes = await ProvaIndividualModel.collection.getIndexes();
    Object.entries(newIndexes).forEach(([key, index]) => {
      console.log(`  ${key}:`, index);
    });

    console.log('\n✅ Script executado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fixIndex();
