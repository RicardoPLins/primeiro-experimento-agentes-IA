import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProva } from '../hooks/useProvas';

export const VisualizarProva: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: prova, isLoading } = useProva(id);

  if (isLoading) return <div className="p-6 text-center">Carregando...</div>;
  if (!prova) return <div className="p-6 text-center text-red-500">Prova não encontrada</div>;

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('pt-BR');
  const identificacaoLabel = prova.identificacao === 'LETRAS' ? '(A, B, C, D, E)' : '(1, 2, 4, 8, 16)';

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/provas')}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{prova.nome}</h1>
            <p className="text-gray-600 mt-2">{prova.disciplina}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">{formatDate(prova.data)}</p>
            <p className="text-gray-600">Turma: {prova.turma}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <p className="text-xs text-gray-600">Professor</p>
            <p className="font-semibold">{prova.professor}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Questões</p>
            <p className="font-semibold">{prova.questoes.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Identificação</p>
            <p className="font-semibold text-sm">{identificacaoLabel}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Total Alternativas</p>
            <p className="font-semibold">{prova.questoes.reduce((sum, q) => sum + q.alternativas.length, 0)}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/provas/${prova.id}/editar`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => navigate(`/pdf/${prova.id}`)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            🖨️ Gerar PDF
          </button>
          <button
            onClick={() => navigate(`/prova-individual/${prova.id}`)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            📋 Criar Instância
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4">📝 Questões da Prova</h2>
        <div className="space-y-4">
          {prova.questoes.map((questao, idx) => (
            <div key={questao.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-2">{questao.enunciado}</p>
                  <div className="space-y-1 text-sm">
                    {questao.alternativas.map((alt) => (
                      <div
                        key={alt.id}
                        className={`p-2 rounded ${alt.isCorreta ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                      >
                        {alt.isCorreta && '✓ '}
                        {alt.descricao}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
