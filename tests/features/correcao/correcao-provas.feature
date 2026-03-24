# language: pt
Funcionalidade: Correção de Provas

  Contexto:
    Dado que existe uma prova com gabarito gerado

  Cenário: Corrigir prova modo rigoroso com acertos totais
    Dado uma prova em modo RIGOROSA
    E o gabarito é: AC,B,ABD,E,BC
    E as respostas do aluno são: AC,B,ABD,E,BC
    Quando o sistema corrige a prova
    Então a nota final deve ser 100

  Cenário: Corrigir prova modo rigoroso com um acerto parcial
    Dado uma prova em modo RIGOROSA
    E o gabarito é: AC,B,ABD,E,BC
    E as respostas do aluno são: AC,B,AD,E,BC
    Quando o sistema corrige a prova
    Então a questão 3 deve ter nota 0 (parcialmente correta não conta)
    E as outras questões devem ter nota 1 cada
    E a nota final deve ser 80

  Cenário: Corrigir prova modo rigoroso com omissão
    Dado uma prova em modo RIGOROSA
    E o gabarito é: AC,B,ABD,E,BC
    E as respostas do aluno são: AC,,ABD,E,BC
    Quando o sistema corrige a prova
    Então a questão 2 deve ter nota 0 (omissão)
    E a nota final deve ser 80

  Cenário: Corrigir prova modo menos rigoroso com acertos proporcionais
    Dado uma prova em modo MENOS_RIGOROSA
    E a questão 1 tem gabarito: [A, C] (2 alternativas corretas)
    E as respostas do aluno para Q1 são: [A] (1 acertada, 1 omitida)
    Quando o sistema corrige a prova
    Então a nota da questão 1 deve ser 50% do peso (1 de 2)

  Cenário: Corrigir prova modo menos rigoroso com seleção incorreta
    Dado uma prova em modo MENOS_RIGOROSA
    E a questão 1 tem gabarito: [A, C] (2 alternativas corretas)
    E as respostas do aluno para Q1 são: [A, B] (1 correta, 1 incorreta)
    Quando o sistema corrige a prova
    Então a nota da questão 1 deve ser 25% do peso (1 correta, 1 incorreta de 4 possíveis)

  Cenário: Importar respostas CSV do Google Forms
    Dado um arquivo CSV com respostas:
      """
      timestamp,email,numero_prova,q1,q2,q3,q4,q5
      2024-03-24 10:00:00,joao@email.com,1,AC,B,ABD,E,BC
      2024-03-24 10:05:00,maria@email.com,1,AC,B,AD,E,BC
      """
    Quando o sistema importa as respostas
    Então deve criar 2 registros de resposta
    E associar corretamente número_prova com gabarito

  Cenário: Gerar relatório de notas
    Dado que 3 provas foram corrigidas
    Quando o sistema gera o relatório de notas
    Então deve conter 3 linhas de dados
    E cada linha deve ter: email, nome, nota_final, nota_q1, nota_q2, nota_q3, nota_q4, nota_q5
    E deve estar ordenado por nota_final descendente

  Cenário: CSV de respostas malformado - coluna faltando
    Dado um arquivo CSV com coluna de questão faltando
    Quando o sistema tenta importar
    Então deve retornar erro VALIDATION_ERROR
    E mencionar qual coluna está faltando

  Cenário: CSV de respostas malformado - número de prova inválido
    Dado um arquivo CSV com número de prova inexistente
    Quando o sistema tenta importar
    Então deve retornar erro NOT_FOUND para o número de prova
