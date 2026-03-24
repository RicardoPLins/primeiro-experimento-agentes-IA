# language: pt
Funcionalidade: Geração de PDF com Embaralhamento

  Contexto:
    Dado que existe uma prova template com 5 questões
    E cada questão tem 5 alternativas

  Cenário: Gerar prova individual modo LETRAS com embaralhamento
    Quando o sistema gera uma prova individual número 1 em modo LETRAS
    Então deve ser criada uma prova individual com ID único
    E o número sequencial da prova deve ser 1
    E as questões devem estar embaralhadas
    E as alternativas de cada questão devem estar embaralhadas
    E o mapeamento de embaralhamento deve ser persistido para auditoria

  Cenário: Gerar prova individual modo POTENCIAS_DE_2 com embaralhamento
    Quando o sistema gera uma prova individual número 2 em modo POTENCIAS_DE_2
    Então deve ser criada uma prova individual com ID único
    E o número sequencial da prova deve ser 2
    E as questões devem estar embaralhadas
    E as alternativas devem estar mapeadas para potências de 2 (1,2,4,8,16)

  Cenário: Reproductibilidade do embaralhamento
    Quando o sistema gera duas provas individuais com o mesmo seed
    Então as duas provas devem ter ordem idêntica de questões e alternativas

  Cenário: Próximo número sequencial
    Dado que existem 5 provas individuais já geradas
    Quando o sistema gera uma nova prova individual
    Então o número sequencial deve ser 6

  Cenário: Gerar gabarito CSV
    Dado que foram geradas 3 provas individuais
    Quando o sistema exporta o gabarito em CSV
    Então deve conter uma linha de cabeçalho
    E deve conter 3 linhas de dados (uma por prova)
    E cada linha deve ter: numero_prova, resposta_q1, resposta_q2, resposta_q3, resposta_q4, resposta_q5

  Cenário: Formato gabarito CSV modo LETRAS
    Dado uma prova individual em modo LETRAS
    E o gabarito é: AC,B,ABD,E,BC
    Quando o sistema exporta o gabarito
    Então a linha CSV deve conter as letras concatenadas: AC,B,ABD,E,BC

  Cenário: Formato gabarito CSV modo POTENCIAS_DE_2
    Dado uma prova individual em modo POTENCIAS_DE_2
    E o gabarito é: 6 (1+2+4), 1, 12 (4+8), 8, 3 (1+2)
    Quando o sistema exporta o gabarito
    Então a linha CSV deve conter as somas: 6,1,12,8,3
