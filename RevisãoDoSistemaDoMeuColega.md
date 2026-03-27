# Revisão do Sistema do Colega

## 1. O sistema está funcionando com as funcionalidades solicitadas?
O sistema não foi implementado com todas as funcionalidades pedidas, na parte de questões só é possível criar questões de multipla escolha (não de soma), consigo gerar as provas e pdfs e csv da correção foram corretos, mas na parte de correção com dois csvs, retorna sucesso, mas não mostra a porcentagem de acerto na tela.

## 2. Quais os problemas de qualidade do código e dos testes?
O código foi bem separado em módulos, mas apresenta muito uso de try/catch no front, e não foram gerados o testes com o gherkin. Utilizou uma estratégia prisma para conexão com o banco que acho que não seja a melhor estratégia. Não implementou no código as funcionalidades pedidas, somente parcialmente de questão.

## 3. Como a funcionalidade e a qualidade desse sistema pode ser comparada com as do seu sistema?
As funcionalidades desse sistema não foram todas feitas, a interface achei básica, regras de negócio não foram bem definidas (posso criar questões com quantas questões quiser e multipla escolha com mais de uma certa), mas consegui gerar provas e pdf, porém não vi no front a correção das provas com os csvs, mas vejo no terminal do backend (parcialmente desenvolvida).

---

### 1. Estratégias de interação utilizada
Não utilizou agents e nem skills, prompts grandes com contextualização e pedindo para criar um requisito e desenvolve-lo no back e front. Entregou o prompt com exemplos o que acho que auxiliou o agente a entender melhor o que fazer.

### 2. Situações em que o agente funcionou melhor ou pior
O agente funcionou melhor na criação do frontend, entretando em algumas parte do back não respondeu bem.

### 3. Tipos de problemas observados (por exemplo, código incorreto ou inconsistências)
Foram identificados problemas no frontend que não está mostrando a correção dos csvs com a respectiva porcentagem de acerto. É gerando somente um pdf com todas a quantidade de provas pedidas e não tem no código o rodapé.

### 4. Avaliação geral da utilidade do agente no desenvolvimento
Acredito que mesmo com a pouca experiência com o uso de agentes, ele consegiu desenvolver bem, explicar bem os prompts e com uma quantidade razoável, entregou um sistema utilizável e com boas conexões de back e front e com o banco SQlite.

### 5. Comparação com a sua experiência de uso do agente
A minha utilização teve bem mais prompts para construir com mais detalhes o sistema, em questão de comparação tive 30 prompts a mais, o atual utilizou uma boa abordagem de dá exemplos para contextualizar melhor, eu primeiro fiz um agent.md e pedi para gerar skill, auxiliou um pouco mais no direcionamento do agente, usei a estrategia de prompts mais curtos, para solucionar problemas especificos, o que gerou uma maior quantidade de interações.