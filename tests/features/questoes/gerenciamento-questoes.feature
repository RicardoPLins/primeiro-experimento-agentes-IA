# language: pt
Funcionalidade: Gerenciamento de Questões

  Contexto:
    Dado que o sistema não possui questões cadastradas

  Cenário: Criar uma questão com alternativas válidas
    Quando o usuário cria uma questão com:
      | campo         | valor                    |
      | enunciado     | Qual é a capital do Brasil? |
      | alternativas  | 5                        |
      | isCorretas    | true,false,false,false,false |
    Então a questão deve ser salva com sucesso
    E o sistema deve listar 1 questão cadastrada

  Cenário: Tentar criar questão com enunciado vazio
    Quando o usuário tenta criar uma questão com enunciado vazio
    Então deve receber erro de validação com código VALIDATION_ERROR

  Cenário: Tentar criar questão com menos de 5 alternativas
    Quando o usuário tenta criar uma questão com 4 alternativas
    Então deve receber erro de validação informando mínimo de 5 alternativas

  Cenário: Tentar criar questão sem alternativa correta
    Quando o usuário tenta criar uma questão com 5 alternativas e nenhuma marcada como correta
    Então deve receber erro de validação "Pelo menos uma alternativa deve estar marcada como correta"

  Cenário: Buscar questão por ID
    Dado que uma questão foi criada com sucesso
    Quando o usuário busca a questão pelo ID
    Então a questão deve ser retornada com todos os dados corretos

  Cenário: Buscar questão inexistente
    Quando o usuário busca uma questão com ID inexistente
    Então deve receber erro NOT_FOUND com status HTTP 404

  Cenário: Atualizar questão existente
    Dado que uma questão foi criada com sucesso
    Quando o usuário atualiza o enunciado da questão
    Então a questão deve ser atualizada com sucesso

  Cenário: Tentar atualizar questão com dados inválidos
    Dado que uma questão foi criada com sucesso
    Quando o usuário tenta atualizar a questão com enunciado vazio
    Então deve receber erro de validação

  Cenário: Excluir questão não vinculada
    Dado que uma questão foi criada com sucesso
    E a questão não está vinculada a nenhuma prova
    Quando o usuário exclui a questão
    Então a questão deve ser removida com sucesso

  Cenário: Tentar excluir questão vinculada a prova
    Dado que uma questão foi criada e está vinculada a uma prova
    Quando o usuário tenta excluir a questão
    Então deve receber erro REFERENTIAL_INTEGRITY_ERROR com status HTTP 409
