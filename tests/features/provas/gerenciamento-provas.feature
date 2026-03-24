# language: pt
Funcionalidade: Gerenciamento de Provas

  Contexto:
    Dado que o sistema não possui provas cadastradas
    E existem 5 questões válidas no banco de dados

  Cenário: Criar uma prova com dados válidos (modo LETRAS)
    Quando o usuário cria uma prova com:
      | campo           | valor                 |
      | nome            | Prova de Matemática   |
      | disciplina      | Matemática            |
      | professor       | João Silva            |
      | turma           | 3º A                  |
      | identificacao   | LETRAS                |
      | questoes        | 5                     |
    Então a prova deve ser salva com sucesso
    E o sistema deve listar 1 prova cadastrada

  Cenário: Criar uma prova com dados válidos (modo POTENCIAS_DE_2)
    Quando o usuário cria uma prova com:
      | campo           | valor                 |
      | nome            | Prova de Física       |
      | disciplina      | Física                |
      | professor       | Maria Santos          |
      | turma           | 2º B                  |
      | identificacao   | POTENCIAS_DE_2        |
      | questoes        | 5                     |
    Então a prova deve ser salva com sucesso

  Cenário: Tentar criar prova com menos de 5 questões
    Quando o usuário tenta criar uma prova com 4 questões
    Então deve receber erro de validação informando exatamente 5 questões

  Cenário: Tentar criar prova com identificação inválida
    Quando o usuário tenta criar uma prova com identificacao "INVALIDA"
    Então deve receber erro de validação com código VALIDATION_ERROR

  Cenário: Buscar prova por ID
    Dado que uma prova foi criada com sucesso
    Quando o usuário busca a prova pelo ID
    Então a prova deve ser retornada com todas as questões

  Cenário: Listar todas as provas
    Dado que 3 provas foram criadas
    Quando o usuário lista todas as provas
    Então deve receber uma lista com 3 provas

  Cenário: Atualizar dados da prova
    Dado que uma prova foi criada com sucesso
    Quando o usuário atualiza o nome da prova
    Então a prova deve ser atualizada com sucesso

  Cenário: Excluir prova
    Dado que uma prova foi criada com sucesso
    Quando o usuário exclui a prova
    Então a prova deve ser removida com sucesso
