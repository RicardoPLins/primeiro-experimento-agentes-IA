import { FC } from 'react';
import { Questao } from '@gerenciador-provas/shared';
import { Button } from './ui';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestaoCardProps {
  questao: Questao;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  index?: number;
}

export const QuestaoCard: FC<QuestaoCardProps> = ({
  questao,
  onEdit,
  onDelete,
  isSelectable,
  isSelected,
  onSelect,
  index,
}) => {
  const corretasCount = questao.alternativas.filter((a) => a.isCorreta).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`bg-white rounded-lg p-6 shadow-sm border-2 transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:shadow-md'
        }`}
      >
        <div className="flex gap-4">
          {isSelectable && (
            <input
              type="checkbox"
              checked={isSelected || false}
              onChange={() => onSelect?.(questao.id)}
              className="w-6 h-6 accent-blue-600 cursor-pointer mt-1 flex-shrink-0"
            />
          )}

          {index !== undefined && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {index + 1}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base text-gray-900 mb-3 line-clamp-2">
              {questao.enunciado}
            </p>

            <div className="space-y-2 mb-4">
              {questao.alternativas.map((alt, idx) => (
                <div
                  key={alt.id}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                    alt.isCorreta ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + idx)}).</span>
                  <span className="flex-1">{alt.descricao}</span>
                  {alt.isCorreta && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                </div>
              ))}
            </div>

            <div className="flex gap-2 text-xs text-gray-600 mb-4">
              <span>❓ {questao.alternativas.length} alternativas</span>
              <span>•</span>
              <span>✓ {corretasCount} correta{corretasCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-2 flex-shrink-0">
              {onEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(questao.id)}
                  icon={<Edit2 className="w-4 h-4" />}
                >
                  Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(questao.id)}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Deletar
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
