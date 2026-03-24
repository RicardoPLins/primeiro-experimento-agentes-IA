1. Gerenciamento (inclusão, alteração e remoção) de questões fechadas de provas. Cada
questão tem um enunciado e um conjunto de alternativas. Cada alternativa tem a sua
descrição e a indicação de se ela deve ser marcada ou não pelo aluno.

2. Gerenciamento (inclusão, alteração e remoção) de provas. Cada prova é criada a partir da
seleção de um conjunto de questões previamente cadastradas no sistema. O usuário deve
informar se, para a prova sendo criada, as alternativas das questões devem ser identificadas
por letras ou por potências de 2 (1, 2, 4, 8, 16, 32,...). No caso de letras, deve haver espaço
após a questão para que o aluno indique as letras marcadas. No caso das potências, deve
haver espaço para o aluno indicar a soma das alternativas marcadas pelo aluno.

3. Geração dos PDFs de um número (fornecido pelo usuário) de provas individuais, variando a
ordem em que as questões e as alternativas aparecem em cada prova. Cada PDF deve ter o
cabeçalho da prova (com nome da disciplina, professor, data, etc.). Cada página da prova
deve ter com rodapé o número da prova individual gerada pelo sistema. No final do PDF,
deve ter espaço para o aluno informar seu nome e CPF). O sistema deve gerar também um
CSV com o gabarito de cada prova. Cada linha do CSV contém informações sobre uma
prova: o número da prova, seguido do gabarito de cada questão da prova (as letras que
deveriam ser selecionadas, ou o somatório esperado).

4. Por fim, o sistema deve permitir a correção das provas e a geração do relatório de notas da
turma. Para corrigir a prova, deve-se informar ao sistema o CSV com o gabarito e outro
CSV com as respostas informadas pelo aluno (normalmente através de um google forms que
coleta o número da prova e a resposta dada pelo aluno para cada questão). A prova deve ser
corrigida de forma mais (uma alternativa que incorretamente foi selecionada ou deixada de
ser selecionada zera toda a questão) ou menos (a nota da questão é proporcional ao
percentual de alternativas selecionadas ou deixadas de ser selecionadas incorretamente)
rigorosa.