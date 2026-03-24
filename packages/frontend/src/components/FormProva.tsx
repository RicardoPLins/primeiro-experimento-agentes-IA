import { FC, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Prova, Identificacao } from '@gerenciador-provas/shared';
import { useQuestoes } from '../hooks/useQuestoes';
import { useCriarProva, useAtualizarProva } from '../hooks/useProvas';
import { useUiStore } from '../store/uiStore';

const provaSchema = z.object({
  nome: z.string().min(5, 'Nome deve ter mínimo 5 caracteres'),
  disciplina: z.string().min(2, 'Disciplina obrigatória'),
  professor: z.string().min(2, 'Professor obrigatório'),
  turma: z.string().min(1, 'Turma obrigatória'),
  data: z.string().min(1, 'Data obrigatória'),
  identificacao: z.enum(['LETRAS', 'POTENCIAS_DE_2'] as const),
  questoes: z.array(z.string()).min(5, 'Mínimo 5 questões').max(5, 'Máximo 5 questões'),
});

type FormProvaData = z.infer<typeof provaSchema>;

interface FormProvaProps {
  prova?: Prova;
  onSuccess?: () => void;
}

export const FormProva: FC<FormProvaProps> = ({ prova, onSuccess }) => {
  const { data: questoes = [] } = useQuestoes();
  const criarMutation = useCriarProva();
  const atualizarMutation = prova ? useAtualizarProva(prova.id) : null;
  const showToast = useUiStore((s) => s.showToast);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormProvaData>({
    resolver: zodResolver(provaSchema),
    defaultValues: {
      nome: prova?.nome || '',
      disciplina: prova?.disciplina || '',
      professor: prova?.professor || '',
      turma: prova?.turma || '',
      data: prova?.data ? new Date(prova.data).toISOString().split('T')[0] : '',
      identificacao: prova?.identificacao || 'LETRAS',
      questoes: prova?.questoes?.map((q) => q.id) || [],
    },
  });

  const questoesIds = watch('questoes');
  const questoesSelecionadas = useMemo(
    () => questoes.filter((q) => questoesIds.includes(q.id)),
    [questoes, questoesIds]
  );

  const onSubmit = async (data: FormProvaData) => {
    try {
      const payload: any = {
        nome: data.nome,
        disciplina: data.disciplina,
        professor: data.professor,
        turma: data.turma,
        data: new Date(data.data),
        identificacao: data.identificacao as Identificacao,
        questoes: questoesSelecionadas,
        updatedAt: new Date(),
      };

      if (prova) {
        await atualizarMutation?.mutateAsync(payload);
        showToast('Prova atualizada!', 'success');
      } else {
        await criarMutation.mutateAsync(payload);
        showToast('Prova criada!', 'success');
      }
      onSuccess?.();
    } catch {
      showToast('Erro ao salvar prova', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg p-6 shadow-md max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">{prova ? '✏️ Editar Prova' : '➕ Nova Prova'}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Prova</label>
          <input
            {...register('nome')}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Prova de Biologia - Unidade 1"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
          <input
            {...register('disciplina')}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Biologia"
          />
          {errors.disciplina && <p className="text-red-500 text-sm mt-1">{errors.disciplina.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
          <input
            {...register('professor')}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Dr. João Silva"
          />
          {errors.professor && <p className="text-red-500 text-sm mt-1">{errors.professor.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
          <input
            {...register('turma')}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 3º A"
          />
          {errors.turma && <p className="text-red-500 text-sm mt-1">{errors.turma.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            {...register('data')}
            type="date"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.data && <p className="text-red-500 text-sm mt-1">{errors.data.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Identificação</label>
          <select
            {...register('identificacao')}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="LETRAS">Letras (A, B, C, D, E)</option>
            <option value="POTENCIAS_DE_2">Potências de 2 (1, 2, 4, 8, 16)</option>
          </select>
          {errors.identificacao && (
            <p className="text-red-500 text-sm mt-1">{errors.identificacao.message}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Selecionar 5 Questões {questoesIds.length}/5
        </label>
        <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50">
          {questoes.length === 0 ? (
            <p className="text-gray-500">Nenhuma questão disponível. Crie questões primeiro.</p>
          ) : (
            questoes.map((questao) => (
              <label key={questao.id} className="flex items-start gap-3 p-3 bg-white rounded hover:bg-blue-50 cursor-pointer">
                <input
                  {...register('questoes')}
                  type="checkbox"
                  value={questao.id}
                  className="w-4 h-4 mt-1 accent-blue-600"
                  disabled={questoesIds.length === 5 && !questoesIds.includes(questao.id)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">{questao.enunciado}</p>
                  <p className="text-xs text-gray-600">{questao.alternativas.length} alternativas</p>
                </div>
              </label>
            ))
          )}
        </div>
        {errors.questoes && <p className="text-red-500 text-sm mt-1">{errors.questoes.message}</p>}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">📋 Resumo</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>{questoesSelecionadas.length}/5</strong> questões selecionadas</li>
          <li>• Formato: <strong>{watch('identificacao')}</strong></li>
          <li>• Total de alternativas: <strong>{questoesSelecionadas.reduce((sum, q) => sum + q.alternativas.length, 0)}</strong></li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={criarMutation.isPending || atualizarMutation?.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {criarMutation.isPending || atualizarMutation?.isPending ? 'Salvando...' : 'Salvar Prova'}
      </button>
    </form>
  );
};
