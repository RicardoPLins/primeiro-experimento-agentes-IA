import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Questao } from '@gerenciador-provas/shared';
import { useCriarQuestao, useAtualizarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';

const questaoSchema = z.object({
  enunciado: z.string().min(10, 'Mínimo 10 caracteres'),
  alternativas: z.array(
    z.object({
      descricao: z.string().min(2, 'Descrição obrigatória'),
      isCorreta: z.boolean(),
    })
  ).min(5, 'Mínimo 5 alternativas'),
});

type FormQuestaoData = z.infer<typeof questaoSchema>;

interface FormQuestaoProps {
  questao?: Questao;
  onSuccess?: () => void;
}

export const FormQuestao: FC<FormQuestaoProps> = ({ questao, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormQuestaoData>({
    resolver: zodResolver(questaoSchema),
    defaultValues: {
      enunciado: questao?.enunciado || '',
      alternativas: questao?.alternativas || Array(5).fill({ descricao: '', isCorreta: false }),
    },
  });

  const criarMutation = useCriarQuestao();
  const atualizarMutation = questao ? useAtualizarQuestao(questao.id) : null;
  const showToast = useUiStore((s) => s.showToast);
  const alternativas = watch('alternativas');

  const onSubmit = async (data: FormQuestaoData) => {
    try {
      // Type cast para backend - adiciona updatedAt
      const payload: any = { ...data, updatedAt: new Date() };
      if (questao) {
        await atualizarMutation?.mutateAsync(payload);
        showToast('Questão atualizada com sucesso!', 'success');
      } else {
        await criarMutation.mutateAsync(payload);
        showToast('Questão criada com sucesso!', 'success');
      }
      onSuccess?.();
    } catch (err) {
      showToast('Erro ao salvar questão', 'error');
    }
  };

  const isLoading = criarMutation.isPending || atualizarMutation?.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">{questao ? '✏️ Editar Questão' : '➕ Nova Questão'}</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Enunciado</label>
        <textarea
          {...register('enunciado')}
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Digite o enunciado da questão"
        />
        {errors.enunciado && <p className="text-red-500 text-sm mt-1">{errors.enunciado.message}</p>}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Alternativas</h3>
        {alternativas.map((_, idx) => (
          <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  {...register(`alternativas.${idx}.descricao`)}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Alternativa ${String.fromCharCode(65 + idx)}`}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register(`alternativas.${idx}.isCorreta`)}
                  type="checkbox"
                  className="w-4 h-4"
                />
                <span className="text-sm">Correta</span>
              </label>
            </div>
          </div>
        ))}
        {errors.alternativas && <p className="text-red-500 text-sm">{errors.alternativas.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isLoading ? 'Salvando...' : 'Salvar Questão'}
      </button>
    </form>
  );
};
