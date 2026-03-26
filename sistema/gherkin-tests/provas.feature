# language: pt
Funcionalidade: Gerenciamento de Provas
  Como um professor
  Quero criar, editar e visualizar provas
  Para aplicá-las aos alunos

  Contexto:
    Dado que estou na página de Provas
    E existem pelo menos 5 questões no sistema

  Cenário: Criar uma nova prova com sucesso
    Quando clico no botão "Criar Prova"
    E preencho o nome da prova com "Prova 1 - Matemática"
    E preencho a descrição com "Avaliação de álgebra e geometria"
    E seleciono 5 questões da lista disponível
    E clico em "Criar Prova"
    Então vejo a mensagem "Prova criada com sucesso"
    E a prova aparece na lista de provas

  Cenário: Tentar criar prova sem nome
    Quando clico no botão "Criar Prova"
    E deixo o campo de nome vazio
    E seleciono 5 questões
    E clico em "Criar Prova"
    Então vejo a mensagem de erro "Nome da prova é obrigatório"
    E a prova não é criada

  Cenário: Tentar criar prova com menos de 5 questões
    Quando clico no botão "Criar Prova"
    E preencho o nome corretamente
    E seleciono apenas 3 questões
    E clico em "Criar Prova"
    Então vejo a mensagem de erro "Selecione pelo menos 5 questões"
    E a prova não é criada

  Cenário: Visualizar detalhes de uma prova
    Dado que existe uma prova chamada "Prova 1 - Matemática"
    Quando clico em visualizar desta prova
    Então vejo o nome, descrição e todas as 5 questões
    E cada questão mostra seu enunciado e alternativas

  Cenário: Editar uma prova existente
    Dado que existe uma prova chamada "Prova 1 - Matemática"
    Quando clico em editar desta prova
    E altero o nome para "Prova 1 - Matemática (Revisada)"
    E removo 1 questão e adiciono outra
    E clico em "Salvar"
    Então vejo a mensagem "Prova atualizada com sucesso"
    E a prova é atualizada na lista

  Cenário: Gerar provas individuais para cada série
    Dado que existe uma prova chamada "Prova 1 - Matemática"
    E clico em "Gerar Provas Individuais"
    Quando seleciono a série "1º Ano"
    E clico em "Gerar"
    Então vejo as provas individuais geradas
    E cada prova tem espaço para nome e CPF do aluno

  Cenário: Deletar uma prova
    Dado que existe uma prova chamada "Prova Teste"
    Quando clico em deletar desta prova
    E confirmo a exclusão
    Então vejo a mensagem "Prova deletada com sucesso"
    E a prova não aparece mais na lista

  Cenário: Listar todas as provas criadas
    Dado que existem 3 provas no sistema
    Quando acesso a página de Provas
    Então vejo todas as 3 provas listadas
    E cada prova mostra nome, descrição e quantidade de questões
