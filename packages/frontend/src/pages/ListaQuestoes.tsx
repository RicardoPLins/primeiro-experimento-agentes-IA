import { FC, useState } from 'react';
import { useQuestoes, useDeletarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { QuestaoCard } from '../components/QuestaoCard';
import { Button, Input, Tabs } from '../components/ui';
import { BookOpen, Grid3X3, List, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const viewTabs = [
    { label: 'Grid', value: 'grid', icon: <Grid3X3 className="w-4 h-4" /> },
    { label: 'Lista', value: 'list', icon: <List className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Questões</h1>
            </div>
            <p className="text-gray-600">
              Total: <strong>{filtradas.length}</strong> questão{filtradas.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/questoes/nova')}>
            <Plus className="w-4 h-4" />
            Nova Questão
          </Button>
        </div>
      </motion.div>

      {/* Filters & Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6"
      >
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Buscar questões"
              placeholder="Digite o enunciado..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Tabs
            items={viewTabs}
            activeTab={view}
            onTabChange={(val) => setView(val as 'grid' | 'list')}
            variant="pills"
          />
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin mb-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
            </div>
            <p className="text-gray-600">Carregando questões...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filtradas.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center py-16"
        >
          <div className="text-center bg-white rounded-xl p-8 border border-gray-200 shadow-sm max-w-md">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filtro ? 'Nenhuma questão encontrada' : 'Nenhuma questão criada'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filtro
                ? 'Tente ajustar seus critérios de busca'
                : 'Comece criando sua primeira questão'}
            </p>
            {!filtro && (
              <Button
                variant="primary"
                onClick={() => navigate('/questoes/nova')}
              >
                <Plus className="w-4 h-4" />
                Criar Questão
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Grid View */}
      {!isLoading && view === 'grid' && filtradas.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtradas.map((questao, idx) => (
            <QuestaoCard
              key={questao.id}
              questao={questao}
              index={idx}
              onEdit={(id) => navigate(`/questoes/${id}/editar`)}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      {/* List View */}
      {!isLoading && view === 'list' && filtradas.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {filtradas.map((questao, idx) => (
            <motion.div
              key={questao.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Questão {idx + 1}</p>
                  <p className="text-base font-medium text-gray-900 line-clamp-2">
                    {questao.enunciado}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/questoes/${questao.id}/editar`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(questao.id)}
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
