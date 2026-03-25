import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Questao } from '@gerenciador-provas/shared';
import { useCriarQuestao, useAtualizarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';
import { Button, Input, Textarea, Card, Alert } from './ui';
import { CheckCircle } from 'lucide-react';

const questaoSchema = z.object({
  enunciado: z.string().min(10, 'Mínimo 10 caracteres'),
  alternativas: z.array(
    z.object({
      descricao: z.string().min(2, 'Descrição obrigatória'),
      isCorreta: z.boolean(),
    })
  ).min(5, 'Mínimo 5 alternativas').max(5, 'Máximo 5 alternativas'),
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
  const corretasCount = alternativas?.filter((a) => a.isCorreta).length || 0;

  const onSubmit = async (data: FormQuestaoData) => {
    try {
      // Validar que tem pelo menos 1 resposta correta
      if (corretasCount === 0) {
        showToast('Marque pelo menos 1 alternativa como correta', 'error');
        return;
      }

      const payload: any = { ...data, updatedAt: new Date() };
      if (questao) {
        await atualizarMutation?.mutateAsync(payload);
        showToast('✓ Questão atualizada com sucesso!', 'success');
      } else {
        await criarMutation.mutateAsync(payload);
        showToast('✓ Questão criada com sucesso!', 'success');
      }
      onSuccess?.();
    } catch (err: any) {
      console.error('Erro:', err);
      const mensagem = err?.response?.data?.message || 'Erro ao salvar questão';
      showToast(`✗ ${mensagem}`, 'error');
    }
  };

  const isLoading = criarMutation.isPending || atualizarMutation?.isPending;

  return (
    <Card className="p-6 max-w-2xl mx-auto" animated>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {questao ? '✏️ Editar Questão' : '✨ Criar Nova Questão'}
        </h2>
        <p className="text-gray-600 mt-2">
          {questao ? 'Atualize os dados da questão' : 'Preencha todos os campos para criar uma nova questão'}
        </p>
      </div>

      {criarMutation.isError && (
        <Alert
          type="error"
          title="Erro na criação"
          message="Verifique os dados e tente novamente"
          onClose={() => criarMutation.reset()}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Textarea
          label="Enunciado da Questão"
          placeholder="Digite o enunciado da questão aqui..."
          maxLength={500}
          helperText="Descreva a questão de forma clara e objetiva"
          error={errors.enunciado?.message}
          {...register('enunciado')}
          required
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Alternativas</h3>
            <div className="text-sm text-gray-600">
              Respostas corretas: <span className="font-bold text-blue-600">{corretasCount}/1+</span>
            </div>
          </div>

          <div className="grid gap-3">
            {alternativas?.map((_, idx) => (
              <Card key={idx} className="p-4 bg-gray-50" hover={false}>
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder={`Alternativa ${String.fromCharCode(65 + idx)}`}
                      error={errors.alternativas?.[idx]?.descricao?.message}
                      {...register(`alternativas.${idx}.descricao`)}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      {...register(`alternativas.${idx}.isCorreta`)}
                      type="checkbox"
                      className="w-5 h-5 accent-green-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">Correta</span>
                  </label>
                </div>
              </Card>
            ))}
          </div>

          {errors.alternativas && (
            <Alert type="error" title="Erro" message={errors.alternativas.message as string} />
          )}
        </div>

        {corretasCount === 0 && alternativas?.every((a) => a.descricao) && (
          <Alert
            type="warning"
            title="Atenção"
            message="Marque pelo menos uma alternativa como correta"
          />
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Validação de Questão</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li>✓ Enunciado: {questao?.enunciado ? '✅' : '⏳'}</li>
              <li>✓ Alternativas: {alternativas?.length === 5 ? '✅' : '⏳'}</li>
              <li>✓ Respostas Corretas: {corretasCount > 0 ? '✅' : '⏳'}</li>
            </ul>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          {isLoading ? 'Salvando...' : questao ? '💾 Atualizar Questão' : '✨ Criar Questão'}
        </Button>
      </form>
    </Card>
  );
};
