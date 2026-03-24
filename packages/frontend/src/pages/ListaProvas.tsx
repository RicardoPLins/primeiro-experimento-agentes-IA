import { FC } from 'react';
import { useProvas, useDeletarProva } from '../hooks/useProvas';
import { useUiStore } from '../store/uiStore';
import { Link } from 'react-router-dom';

export const ListaProvas: FC = () => {
  const { data: provas, isLoading } = useProvas();
  const deletarMutation = useDeletarProva();
  const showToast = useUiStore((s) => s.showToast);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que quer deletar?')) {
      try {
        await deletarMutation.mutateAsync(id);
        showToast('Prova deletada!', 'success');
      } catch {
        showToast('Erro ao deletar', 'error');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📄 Provas</h1>
        <Link
          to="/provas/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          ➕ Nova Prova
        </Link>
      </div>

      {isLoading && <p className="text-gray-600">Carregando...</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {provas?.map((prova) => (
          <div key={prova.id} className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="font-semibold text-lg mb-2">{prova.nome}</h3>
            <p className="text-sm text-gray-600 mb-2">{prova.disciplina}</p>
            <p className="text-sm text-gray-600 mb-4">
              Professor: {prova.professor}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              {prova.questoes.length} questões • {prova.identificacao}
            </p>
            <div className="flex gap-2">
              <Link
                to={`/provas/${prova.id}`}
                className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 text-center"
              >
                📖 Visualizar
              </Link>
              <button
                onClick={() => handleDelete(prova.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {(provas?.length === 0) && !isLoading && (
        <p className="text-center text-gray-600 py-8">Nenhuma prova encontrada</p>
      )}
    </div>
  );
};
