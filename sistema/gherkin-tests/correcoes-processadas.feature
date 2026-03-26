# language: pt
Funcionalidade: Gerenciamento de Correções Processadas
  Como um professor
  Quero salvar, visualizar e gerenciar lotes de correções
  Para manter um histórico de todas as correções realizadas

  Contexto:
    Dado que estou na página de Resultados da Correção
    E a correção foi realizada com sucesso
    E existem dados de alunos para salvar

  Cenário: Salvar correção processada com sucesso
    Quando clico no botão "Salvar em Correções Processadas"
    E preencho o nome do lote com "Prova 1 - Turma A"
    E clico em "Salvar"
    Então vejo a mensagem "Correção salva com sucesso"
    E sou redirecionado para a página de Correções Processadas
    E o novo lote aparece na lista

  Cenário: Tentar salvar correção sem nome de lote
    Quando clico no botão "Salvar em Correções Processadas"
    E deixo o campo de nome do lote vazio
    E clico em "Salvar"
    Então vejo a mensagem de erro "Informe um nome para o lote"
    E a correção não é salva

  Cenário: Visualizar lista de correções processadas
    Dado que existem 3 lotes salvos no sistema
    Quando acesso a página de Correções Processadas
    Então vejo uma tabela com todos os 3 lotes
    E cada lote mostra: nome, data, modo de correção, total de alunos e média

  Cenário: Expandir detalhes de um lote
    Dado que existe um lote chamado "Prova 1 - Turma A"
    Quando clico no ícone de expandir
    Então vejo uma tabela com detalhes de cada aluno
    E para cada aluno vejo: nome, CPF, total de questões, acertos e nota final

  Cenário: Visualizar estatísticas de um lote
    Dado que existe um lote chamado "Prova 1 - Turma A"
    E clico em visualizar
    Então vejo as estatísticas: media geral, nota máxima, nota mínima
    E a distribuição de alunos por faixa de nota

  Cenário: Deletar um lote de correções
    Dado que existe um lote chamado "Prova Teste"
    Quando clico no ícone de deletar
    E confirmo a exclusão
    Então vejo a mensagem "Lote deletado com sucesso"
    E o lote não aparece mais na lista

  Cenário: Atualizar lista de correções processadas
    Dado que estou na página de Correções Processadas
    Quando clico no botão "Atualizar"
    Então a lista é recarregada
    E novos lotes aparecem se foram salvos

  Cenário: Filtrar lotes por período
    Dado que existem lotes salvos em diferentes datas
    Quando seleciono um intervalo de datas
    E clico em "Filtrar"
    Então vejo apenas os lotes dentro do período selecionado

  Cenário: Pesquisar lote por nome
    Dado que existem múltiplos lotes salvos
    Quando preencho o campo de busca com "Turma A"
    E clico em buscar
    Então vejo apenas os lotes que contêm "Turma A" no nome

  Cenário: Visualizar contagem no Dashboard
    Dado que existem 5 lotes salvos
    Quando acesso a página do Dashboard
    Então o card de "Correções Processadas" mostra "5"
    E o número se atualiza em tempo real
