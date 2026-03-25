import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Questao } from '@gerenciador-provas/shared';
import { useCriarQuestao, useAtualizarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';
import { Button, Input, Textarea, Card, Alert } from './ui';
import { CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const questaoSchema = z.object({
  enunciado: z.string().min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
  alternativas: z.array(
    z.object({
      descricao: z.string().min(2, 'Descrição obrigatória').max(200, 'Máximo 200 caracteres'),
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
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FormQuestaoData>({
    resolver: zodResolver(questaoSchema),
    defaultValues: {
      enunciado: questao?.enunciado || '',
      alternativas: questao?.alternativas || Array(5).fill(null).map(() => ({ descricao: '', isCorreta: false })),
    },
  });

  // Reset form quando questão mudar
  useEffect(() => {
    if (questao) {
      reset({
        enunciado: questao.enunciado,
        alternativas: questao.alternativas,
      });
    }
  }, [questao, reset]);

  const criarMutation = useCriarQuestao();
  const atualizarMutation = questao ? useAtualizarQuestao(questao.id) : null;
  const showToast = useUiStore((s) => s.showToast);
  const alternativas = watch('alternativas');
  const enunciado = watch('enunciado');
  const corretasCount = alternativas?.filter((a) => a.isCorreta).length || 0;
  const alternativasPreenchidas = alternativas?.filter((a) => a.descricao.length > 0).length || 0;

  const onSubmit = async (data: FormQuestaoData) => {
    try {
      // Validações extras
      if (corretasCount === 0) {
        showToast('❌ Marque pelo menos 1 alternativa como correta', 'error');
        return;
      }

      if (alternativasPreenchidas < 5) {
        showToast('❌ Todas as 5 alternativas devem ser preenchidas', 'error');
        return;
      }

      const payload: any = { ...data };
      
      if (questao) {
        await atualizarMutation?.mutateAsync(payload);
        showToast('✅ Questão atualizada com sucesso!', 'success');
      } else {
        await criarMutation.mutateAsync(payload);
        showToast('✅ Questão criada com sucesso!', 'success');
      }
      
      onSuccess?.();
    } catch (err: any) {
      console.error('Erro:', err);
      const mensagem = err?.response?.data?.message || err?.message || 'Erro ao salvar questão';
      showToast(`❌ ${mensagem}`, 'error');
    }
  };

  const isLoading = criarMutation.isPending || atualizarMutation?.isPending;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="p-8" animated>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            {questao ? '✏️ Editar Questão' : '✨ Criar Nova Questão'}
          </h2>
          <p className="text-gray-600 mt-2">
            {questao
              ? 'Atualize os dados da questão'
              : 'Preencha todos os campos para criar uma nova questão'}
          </p>
        </motion.div>

        {/* Error Alert */}
        {hasErrors && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert
              type="error"
              title="Erro na validação"
              message="Verifique os campos em vermelho"
            />
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Enunciado */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Textarea
              label="Enunciado da Questão"
              placeholder="Digite o enunciado da questão aqui..."
              maxLength={500}
              helperText={`${enunciado?.length || 0}/500 caracteres`}
              error={errors.enunciado?.message}
              {...register('enunciado')}
              required
            />
          </motion.div>

          {/* Alternativas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Alternativas</h3>
              <motion.div className="flex gap-4 text-sm">
                <div className={corretasCount > 0 ? 'text-green-600' : 'text-yellow-600'}>
                  Corretas: <span className="font-bold">{corretasCount}</span>
                </div>
                <div className={alternativasPreenchidas === 5 ? 'text-green-600' : 'text-yellow-600'}>
                  Preenchidas: <span className="font-bold">{alternativasPreenchidas}/5</span>
                </div>
              </motion.div>
            </div>

            <div className="grid gap-3">
              {alternativas?.map((alt, idx) => {
                const letra = String.fromCharCode(65 + idx);
                const temErro = !!errors.alternativas?.[idx];

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <Card
                      className={`p-4 transition-all ${
                        temErro
                          ? 'bg-red-50 border-red-300'
                          : alt.isCorreta
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50'
                      }`}
                      hover={false}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {letra}
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder={`Alternativa ${letra}`}
                            error={errors.alternativas?.[idx]?.descricao?.message}
                            {...register(`alternativas.${idx}.descricao`)}
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer mt-2 flex-shrink-0">
                          <input
                            {...register(`alternativas.${idx}.isCorreta`)}
                            type="checkbox"
                            className="w-5 h-5 accent-green-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {alt.isCorreta ? '✅ Correta' : 'Correta'}
                          </span>
                        </label>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {errors.alternativas && (
              <Alert
                type="error"
                title="Erro"
                message={errors.alternativas.message as string}
              />
            )}
          </motion.div>

          {/* Validation Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`rounded-lg p-4 border-2 ${
              corretasCount > 0 && alternativasPreenchidas === 5 && enunciado.length >= 10
                ? 'bg-green-50 border-green-300'
                : 'bg-blue-50 border-blue-300'
            }`}
          >
            <div className="flex gap-3">
              {corretasCount > 0 && alternativasPreenchidas === 5 && enunciado.length >= 10 ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="text-sm">
                <p className="font-semibold mb-2 text-gray-900">Checklist de Validação</p>
                <ul className="space-y-1">
                  <li className={enunciado.length >= 10 ? 'text-green-700' : 'text-gray-700'}>
                    {enunciado.length >= 10 ? '✅' : '⏳'} Enunciado preenchido ({enunciado.length}/10)
                  </li>
                  <li className={alternativasPreenchidas === 5 ? 'text-green-700' : 'text-gray-700'}>
                    {alternativasPreenchidas === 5 ? '✅' : '⏳'} Todas as 5 alternativas ({alternativasPreenchidas}/5)
                  </li>
                  <li className={corretasCount > 0 ? 'text-green-700' : 'text-gray-700'}>
                    {corretasCount > 0 ? '✅' : '⏳'} Pelo menos 1 alternativa correta ({corretasCount})
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading || corretasCount === 0 || alternativasPreenchidas < 5}
            >
              {isLoading
                ? 'Salvando...'
                : questao
                ? '💾 Atualizar Questão'
                : '✨ Criar Questão'}
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
};
