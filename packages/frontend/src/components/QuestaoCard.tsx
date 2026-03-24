import { FC } from 'react';
import { Questao } from '@gerenciador-provas/shared';

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
    <div
      className={`bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition border-2 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent'
      }`}
    >
      <div className="flex gap-4">
        {isSelectable && (
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={() => onSelect?.(questao.id)}
            className="w-5 h-5 accent-blue-600 cursor-pointer"
          />
        )}

        {index !== undefined && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {index + 1}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base mb-2 line-clamp-2">{questao.enunciado}</p>

          <div className="space-y-1 text-sm mb-3">
            {questao.alternativas.map((alt, idx) => (
              <div
                key={alt.id}
                className={`px-2 py-1 rounded ${
                  alt.isCorreta ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <span className="font-medium">{String.fromCharCode(65 + idx)}).</span> {alt.descricao}
              </div>
            ))}
          </div>

          <div className="flex gap-2 text-xs text-gray-600">
            <span>❓ {questao.alternativas.length} alternativas</span>
            <span>✓ {corretasCount} correta{corretasCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 flex-shrink-0">
            {onEdit && (
              <button
                onClick={() => onEdit(questao.id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(questao.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
