import 'dotenv/config';
import mongoConnection from './mongo';
import { QuestaoModel } from './questao.schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Script para popular o banco com questões de teste
 */
async function seed(): Promise<void> {
  try {
    console.log('[Seed] Conectando ao MongoDB...');
    await mongoConnection.connect();

    // Verificar se já existem questões
    const count = await QuestaoModel.countDocuments();
    if (count > 0) {
      console.log(`[Seed] Banco já contém ${count} questões. Abortando.`);
      await mongoConnection.disconnect();
      return;
    }

    console.log('[Seed] Criando questões de teste...');

    const questoes = [
      {
        id: uuidv4(),
        enunciado: 'Qual é a capital do Brasil?',
        alternativas: [
          { id: uuidv4(), descricao: 'São Paulo', isCorreta: false },
          { id: uuidv4(), descricao: 'Rio de Janeiro', isCorreta: false },
          { id: uuidv4(), descricao: 'Brasília', isCorreta: true },
          { id: uuidv4(), descricao: 'Salvador', isCorreta: false },
          { id: uuidv4(), descricao: 'Belo Horizonte', isCorreta: false },
        ],
        tipoIdentificacao: 'LETRAS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        enunciado: 'Qual é o planeta mais distante do Sol?',
        alternativas: [
          { id: uuidv4(), descricao: 'Saturno', isCorreta: false },
          { id: uuidv4(), descricao: 'Urano', isCorreta: false },
          { id: uuidv4(), descricao: 'Netuno', isCorreta: true },
          { id: uuidv4(), descricao: 'Plutão', isCorreta: false },
          { id: uuidv4(), descricao: 'Júpiter', isCorreta: false },
        ],
        tipoIdentificacao: 'LETRAS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        enunciado: 'Qual é a maior montanha do mundo?',
        alternativas: [
          { id: uuidv4(), descricao: 'Monte Branco', isCorreta: false },
          { id: uuidv4(), descricao: 'Monte Kilimanjaro', isCorreta: false },
          { id: uuidv4(), descricao: 'Monte Everest', isCorreta: true },
          { id: uuidv4(), descricao: 'Monte Aconcágua', isCorreta: false },
          { id: uuidv4(), descricao: 'Monte Denali', isCorreta: false },
        ],
        tipoIdentificacao: 'LETRAS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        enunciado: 'Em que ano terminou a Segunda Guerra Mundial?',
        alternativas: [
          { id: uuidv4(), descricao: '1943', isCorreta: false },
          { id: uuidv4(), descricao: '1944', isCorreta: false },
          { id: uuidv4(), descricao: '1945', isCorreta: true },
          { id: uuidv4(), descricao: '1946', isCorreta: false },
          { id: uuidv4(), descricao: '1947', isCorreta: false },
        ],
        tipoIdentificacao: 'LETRAS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        enunciado: 'Qual é o idioma oficial da Espanha?',
        alternativas: [
          { id: uuidv4(), descricao: 'Português', isCorreta: false },
          { id: uuidv4(), descricao: 'Castelhano', isCorreta: true },
          { id: uuidv4(), descricao: 'Catalão', isCorreta: false },
          { id: uuidv4(), descricao: 'Basco', isCorreta: false },
          { id: uuidv4(), descricao: 'Francês', isCorreta: false },
        ],
        tipoIdentificacao: 'LETRAS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        enunciado: 'Quantos continentes existem?',
        alternativas: [
          { id: uuidv4(), descricao: '5', isCorreta: false },
          { id: uuidv4(), descricao: '6', isCorreta: true },
          { id: uuidv4(), descricao: '7', isCorreta: false },
          { id: uuidv4(), descricao: '8', isCorreta: false },
          { id: uuidv4(), descricao: '4', isCorreta: false },
        ],
        tipoIdentificacao: 'LETRAS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await QuestaoModel.insertMany(questoes);
    console.log(`[Seed] ${questoes.length} questões criadas com sucesso!`);
    console.log('[Seed] IDs das questões:');
    questoes.forEach((q, idx) => {
      console.log(`  ${idx + 1}. ${q.id}`);
    });

    await mongoConnection.disconnect();
    console.log('[Seed] Concluído!');
  } catch (erro) {
    console.error('[Seed] Erro:', erro);
    process.exit(1);
  }
}

seed();
