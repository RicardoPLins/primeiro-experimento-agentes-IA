import { FC, useState } from 'react';
import { useProvas, useDeletarProva } from '../hooks/useProvas';
import { useUiStore } from '../store/uiStore';
import { Link } from 'react-router-dom';

export const ListaProvas: FC = () => {
  const { data: provas, isLoading } = useProvas();
  const deletarMutation = useDeletarProva();
  const showToast = useUiStore((s) => s.showToast);
  const [filtro, setFiltro] = useState('');

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

  const filtradas = (provas || []).filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    p.disciplina.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📄 Provas</h1>
        <Link
          to="/provas/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          ➕ Nova Prova
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nome ou disciplina..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isLoading && <p className="text-gray-600 text-center py-8">Carregando...</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtradas.map((prova) => (
          <div key={prova.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{prova.nome}</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>📚 {prova.disciplina}</p>
              <p>👨‍🏫 {prova.professor}</p>
              <p>🎓 Turma {prova.turma}</p>
              <p>📅 {new Date(prova.data).toLocaleDateString('pt-BR')}</p>
              <p>❓ {prova.questoes.length} questões</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                to={`/provas/${prova.id}`}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 text-center transition"
              >
                👁️ Visualizar
              </Link>
              <Link
                to={`/provas/${prova.id}/editar`}
                className="bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition"
              >
                ✏️
              </Link>
              <button
                onClick={() => handleDelete(prova.id)}
                className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtradas.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Nenhuma prova encontrada</p>
          <Link
            to="/provas/nova"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ Criar primeira prova
          </Link>
        </div>
      )}
    </div>
  );
};
