import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormQuestao } from '../components/FormQuestao';
import { useQuestao } from '../hooks/useQuestoes';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';

export const CriarEditarQuestao: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: questao, isLoading } = useQuestao(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/questoes')}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Questões
      </motion.button>

      {/* Loading State */}
      {id && isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-20"
        >
          <div className="text-center">
            <div className="animate-spin mb-4">
              <Loader className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600">Carregando questão...</p>
          </div>
        </motion.div>
      )}

      {/* Form */}
      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormQuestao
            questao={questao}
            onSuccess={() => navigate('/questoes')}
          />
        </motion.div>
      )}
    </div>
  );
};
