import { FC, useState } from 'react';
import { useQuestoes, useDeletarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';
import { Link } from 'react-router-dom';

export const ListaQuestoes: FC = () => {
  const { data: questoes, isLoading } = useQuestoes();
  const deletarMutation = useDeletarQuestao();
  const showToast = useUiStore((s) => s.showToast);
  const [filtro, setFiltro] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que quer deletar?')) {
      try {
        await deletarMutation.mutateAsync(id);
        showToast('Questão deletada!', 'success');
      } catch {
        showToast('Erro ao deletar', 'error');
      }
    }
  };

  const filtradas = (questoes || []).filter((q) =>
    q.enunciado.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">❓ Questões</h1>
        <Link
          to="/questoes/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Nova Questão
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por enunciado..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-6 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isLoading && <p className="text-gray-600">Carregando...</p>}

      <div className="space-y-4">
        {filtradas.map((questao) => (
          <div key={questao.id} className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {questao.enunciado}
                </h3>
                <p className="text-sm text-gray-600">
                  {questao.alternativas.length} alternativas
                  {questao.alternativas.some((a) => a.isCorreta) && ' ✓'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/questoes/${questao.id}/editar`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  ✏️ Editar
                </Link>
                <button
                  onClick={() => handleDelete(questao.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  🗑️ Deletar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtradas.length === 0 && !isLoading && (
        <p className="text-center text-gray-600 py-8">Nenhuma questão encontrada</p>
      )}
    </div>
  );
};
