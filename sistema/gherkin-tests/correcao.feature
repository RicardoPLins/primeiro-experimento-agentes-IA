# language: pt
Funcionalidade: Correção de Provas
  Como um professor
  Quero fazer upload de CSVs de respostas dos alunos
  Para comparar com o gabarito e gerar relatórios de correção

  Contexto:
    Dado que estou na página de Correção
    E existe uma prova chamada "Prova 1 - Matemática" no sistema
    E o gabarito está definido corretamente

  Cenário: Fazer upload de CSV de respostas dos alunos com sucesso
    Quando clico no botão "Selecionar Arquivo"
    E seleciono um arquivo CSV válido com respostas
    E clico em "Enviar"
    Então vejo a mensagem "Arquivo enviado com sucesso"
    E o arquivo é processado pelo sistema

  Cenário: Corrigir respostas em modo rigoroso
    Dado que um arquivo CSV foi enviado
    E clico em "Corrigir" no modo "Rigorosa"
    Quando o sistema compara as respostas com o gabarito
    Então vejo os resultados com apenas acertos/erros
    E não há pontuação parcial

  Cenário: Corrigir respostas em modo menos rigoroso
    Dado que um arquivo CSV foi enviado
    E clico em "Corrigir" no modo "Menos Rigorosa"
    Quando o sistema compara as respostas com o gabarito
    Então vejo os resultados com pontuação parcial
    E questões em branco recebem pontuação menor

  Cenário: Visualizar estatísticas gerais da correção
    Dado que a correção foi concluída
    Quando acesso a página de resultados
    Então vejo as estatísticas: total de alunos, média geral, nota máxima e mínima
    E um gráfico de distribuição de notas

  Cenário: Visualizar detalhes de um aluno específico
    Dado que a correção foi concluída
    E clico em um aluno na tabela de resultados
    Quando clico em "Ver Detalhes"
    Então vejo: nome do aluno, CPF, questões acertadas, nota final
    E um resumo de cada questão (correta/incorreta)

  Cenário: Exportar resultados como CSV
    Dado que a correção foi concluída
    E estou na página de resultados
    Quando clico em "Exportar CSV"
    Então um arquivo CSV é baixado com todos os resultados
    E o arquivo contém: nome, CPF, nota final, acertos

  Cenário: Fazer upload de arquivo CSV inválido
    Quando seleciono um arquivo CSV com formato incorreto
    E clico em "Enviar"
    Então vejo a mensagem de erro "Formato de arquivo inválido"
    E o arquivo não é processado

  Cenário: Fazer upload sem selecionar prova
    Quando não seleciono uma prova
    E clico em "Enviar"
    Então vejo a mensagem de erro "Selecione uma prova"
    E o upload não é realizado

  Cenário: Comparação com múltiplos gabaritos
    Dado que existem 2 séries com gabaritos diferentes
    Quando faço upload de um CSV com respostas da série 1
    E seleciono o gabarito correto
    Então o sistema faz a correção com o gabarito da série correta
    E os resultados refletem a correção apropriada
