import { FC, useState } from 'react';
import { useQuestoes, useDeletarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';
import { Link, useNavigate } from 'react-router-dom';
import { QuestaoCard } from '../components/QuestaoCard';

export const ListaQuestoes: FC = () => {
  const { data: questoes, isLoading } = useQuestoes();
  const deletarMutation = useDeletarQuestao();
  const showToast = useUiStore((s) => s.showToast);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          ➕ Nova Questão
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por enunciado..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-4 py-2 rounded-lg transition ${
              view === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⊞ Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-lg transition ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ≡ Lista
          </button>
        </div>
      </div>

      {isLoading && <p className="text-gray-600 text-center py-8">Carregando...</p>}

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtradas.map((questao, idx) => (
            <QuestaoCard
              key={questao.id}
              questao={questao}
              index={idx}
              onEdit={(id) => navigate(`/questoes/${id}/editar`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtradas.map((questao, idx) => (
            <QuestaoCard
              key={questao.id}
              questao={questao}
              index={idx}
              onEdit={(id) => navigate(`/questoes/${id}/editar`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {filtradas.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Nenhuma questão encontrada</p>
          <Link
            to="/questoes/nova"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Criar primeira questão
          </Link>
        </div>
      )}

      {filtradas.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          Total: <strong>{filtradas.length}</strong> questão{filtradas.length !== 1 ? 's' : ''} encontrada
          {filtro && ' (filtrada)'}
        </div>
      )}
    </div>
  );
};
