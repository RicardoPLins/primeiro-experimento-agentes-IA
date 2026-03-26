# language: pt
Funcionalidade: Gerenciamento de Questões
  Como um professor
  Quero criar, editar e deletar questões
  Para poder compor provas com questões bem elaboradas

  Contexto:
    Dado que estou na página de Questões
    E o sistema está carregando corretamente

  Cenário: Criar uma nova questão com sucesso
    Quando clico no botão "Adicionar Questão"
    E preencho o campo de enunciado com "Qual é a capital do Brasil?"
    E preencho a alternativa "A" com "São Paulo"
    E preencho a alternativa "B" com "Brasília"
    E preencho a alternativa "C" com "Salvador"
    E preencho a alternativa "D" com "Rio de Janeiro"
    E marco a alternativa "B" como correta
    E clico em "Salvar"
    Então vejo a mensagem "Questão salva com sucesso"
    E a questão aparece na lista de questões

  Cenário: Tentar criar questão sem enunciado
    Quando clico no botão "Adicionar Questão"
    E deixo o enunciado vazio
    E preencho as alternativas normalmente
    E clico em "Salvar"
    Então vejo a mensagem de erro "Enunciado é obrigatório"
    E a questão não é salva

  Cenário: Tentar criar questão sem resposta correta marcada
    Quando clico no botão "Adicionar Questão"
    E preencho o enunciado
    E preencho as alternativas normalmente
    E não marco nenhuma alternativa como correta
    E clico em "Salvar"
    Então vejo a mensagem de erro "Marque a resposta correta"
    E a questão não é salva

  Cenário: Editar uma questão existente
    Dado que existe uma questão com enunciado "Qual é o maior planeta?"
    Quando clico no botão editar desta questão
    E altero o enunciado para "Qual é o maior planeta do sistema solar?"
    E altero a resposta correta para a alternativa "C"
    E clico em "Salvar"
    Então vejo a mensagem "Questão atualizada com sucesso"
    E a questão é atualizada na lista

  Cenário: Deletar uma questão
    Dado que existe uma questão com enunciado "Qual é a 8ª maravilha?"
    Quando clico no botão deletar desta questão
    E confirmo a exclusão
    Então vejo a mensagem "Questão deletada com sucesso"
    E a questão não aparece mais na lista

  Cenário: Listar todas as questões criadas
    Dado que existem 5 questões no sistema
    Quando acesso a página de Questões
    Então vejo todas as 5 questões listadas
    E cada questão mostra seu enunciado e número de alternativas

  Cenário: Pesquisar questão pelo enunciado
    Dado que existem questões sobre diferentes assuntos
    Quando preencho o campo de busca com "capital"
    E clico em buscar
    Então vejo apenas as questões que contêm "capital" no enunciado
