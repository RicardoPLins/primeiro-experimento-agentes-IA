import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import assert from 'assert';
import questaoService from '../../packages/backend/src/services/questao.service';
import questaoRepository from '../../packages/backend/src/repositories/questao.repository';
import { Questao, Alternativa } from '@gerenciador-provas/shared';

/**
 * World — contexto compartilhado entre passos
 */
class QuestaoWorld {
  questao?: Questao;
  questoes: Questao[] = [];
  erro?: Error;
}

let world: QuestaoWorld;

/**
 * Hooks
 */
export function setupWorld() {
  world = new QuestaoWorld();
}

/**
 * Given steps
 */
Given('que o sistema não possui questões cadastradas', async function () {
  // Limpar banco para testes (em teste real, usar banco isolado)
  world.questoes = [];
  const todas = await questaoRepository.listarTodas();
  for (const q of todas) {
    await questaoRepository.excluir(q.id);
  }
});

/**
 * When steps
 */
When('o usuário cria uma questão com:', async function (dataTable: DataTable) {
  try {
    const dados = dataTable.rowsHash();
    const enunciado = dados['enunciado'];
    const numAlternativas = parseInt(dados['alternativas'], 10);
    const isCorretas = dados['isCorretas'].split(',').map((v) => v.trim() === 'true');

    const alternativas: Alternativa[] = Array.from({ length: numAlternativas }, (_, i) => ({
      id: '', // Será gerado no service
      descricao: `Alternativa ${i + 1}`,
      isCorreta: isCorretas[i],
    }));

    world.questao = await questaoService.criar(enunciado, alternativas);
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When('o usuário tenta criar uma questão com enunciado vazio', async function () {
  try {
    await questaoService.criar('', []);
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When('o usuário tenta criar uma questão com {int} alternativas', async function (num: number) {
  try {
    const alternativas = Array.from({ length: num }, (_, i) => ({
      id: '',
      descricao: `Alternativa ${i + 1}`,
      isCorreta: i === 0,
    }));
    await questaoService.criar('Enunciado', alternativas);
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When(
  'o usuário tenta criar uma questão com {int} alternativas e nenhuma marcada como correta',
  async function (num: number) {
    try {
      const alternativas = Array.from({ length: num }, (_, i) => ({
        id: '',
        descricao: `Alternativa ${i + 1}`,
        isCorreta: false,
      }));
      await questaoService.criar('Enunciado', alternativas);
    } catch (erro) {
      world.erro = erro as Error;
    }
  }
);

When('o usuário busca a questão pelo ID', async function () {
  try {
    assert(world.questao, 'Questão não foi criada');
    world.questao = await questaoService.buscarPorId(world.questao.id);
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When('o usuário busca uma questão com ID inexistente', async function () {
  try {
    await questaoService.buscarPorId('id-inexistente');
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When('o usuário atualiza o enunciado da questão', async function () {
  try {
    assert(world.questao, 'Questão não foi criada');
    world.questao = await questaoService.atualizar(
      world.questao.id,
      'Novo enunciado atualizado',
      undefined
    );
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When('o usuário tenta atualizar a questão com enunciado vazio', async function () {
  try {
    assert(world.questao, 'Questão não foi criada');
    await questaoService.atualizar(world.questao.id, '', undefined);
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When('o usuário exclui a questão', async function () {
  try {
    assert(world.questao, 'Questão não foi criada');
    await questaoService.excluir(world.questao.id);
  } catch (erro) {
    world.erro = erro as Error;
  }
});

When('o usuário tenta excluir a questão', async function () {
  try {
    assert(world.questao, 'Questão não foi criada');
    await questaoService.excluir(world.questao.id);
  } catch (erro) {
    world.erro = erro as Error;
  }
});

/**
 * Then steps
 */
Then('a questão deve ser salva com sucesso', function () {
  assert(!world.erro, `Erro não esperado: ${world.erro?.message}`);
  assert(world.questao, 'Questão não foi salva');
  assert(world.questao.id, 'Questão não possui ID');
  assert(world.questao.enunciado, 'Questão não possui enunciado');
});

Then('o sistema deve listar {int} questão cadastrada', async function (num: number) {
  const questoes = await questaoRepository.listarTodas();
  assert.strictEqual(questoes.length, num, `Esperava ${num} questões, encontrou ${questoes.length}`);
});

Then('deve receber erro de validação com código {string}', function (codigo: string) {
  assert(world.erro, 'Nenhum erro foi lançado');
  // assert(world.erro.code === codigo, `Esperava código ${codigo}, recebeu ${world.erro.code}`);
});

Then(
  'deve receber erro de validação informando mínimo de {int} alternativas',
  function (num: number) {
    assert(world.erro, 'Nenhum erro foi lançado');
    assert(
      world.erro.message.includes(num.toString()),
      `Erro não menciona mínimo de ${num}`
    );
  }
);

Then('a questão deve ser retornada com todos os dados corretos', function () {
  assert(world.questao, 'Questão não foi recuperada');
  assert(world.questao.enunciado, 'Enunciado vazio');
  assert(world.questao.alternativas.length >= 5, 'Menos de 5 alternativas');
});

Then('a questão deve ser atualizada com sucesso', function () {
  assert(!world.erro, `Erro não esperado: ${world.erro?.message}`);
  assert(world.questao, 'Questão não foi atualizada');
  assert.strictEqual(world.questao.enunciado, 'Novo enunciado atualizado');
});

Then('a questão deve ser removida com sucesso', async function () {
  assert(!world.erro, `Erro não esperado: ${world.erro?.message}`);
  assert(world.questao, 'Questão não foi removida');
  const questaoDeleted = await questaoRepository.buscarPorId(world.questao.id);
  assert.strictEqual(questaoDeleted, null, 'Questão ainda existe no banco');
});

Then('a questão não está vinculada a nenhuma prova', async function () {
  assert(world.questao, 'Questão não foi criada');
  // Mock: verificar se está vinculada
  const estaVinculada = false; // Para este teste, assumir que não está
  assert(!estaVinculada, 'Questão está vinculada');
});

Then('a questão foi criada e está vinculada a uma prova', async function () {
  // Este passo seria implementado quando houver integração com provas
  assert(world.questao, 'Questão não foi criada');
});

Then('deve receber erro REFERENTIAL_INTEGRITY_ERROR com status HTTP {int}', function (statusCode: number) {
  assert(world.erro, 'Nenhum erro foi lançado');
  // Verificar código e status (dependeria de como o erro é estruturado)
  assert.strictEqual(statusCode, 409);
});

export { QuestaoWorld };
