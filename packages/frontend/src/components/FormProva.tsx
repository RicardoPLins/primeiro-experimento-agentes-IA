import { FC, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Prova, Identificacao } from '@gerenciador-provas/shared';
import { useQuestoes } from '../hooks/useQuestoes';
import { useCriarProva, useAtualizarProva } from '../hooks/useProvas';
import { useUiStore } from '../store/uiStore';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  Typography,
  Card,
  Checkbox,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<FormProvaData>({
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
      const payload = {
        nome: data.nome,
        disciplina: data.disciplina,
        professor: data.professor,
        turma: data.turma,
        data: new Date(data.data),
        identificacao: data.identificacao as Identificacao,
        questoesIds: data.questoes,
      };

      if (prova) {
        await atualizarMutation?.mutateAsync(payload as any);
        showToast('Prova atualizada!', 'success');
      } else {
        await criarMutation.mutateAsync(payload as any);
        showToast('Prova criada!', 'success');
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar prova:', error);
      showToast('Erro ao salvar prova', 'error');
    }
  };

  const isLoading = criarMutation.isPending || atualizarMutation?.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
          {prova ? '✏️ Editar Prova' : '➕ Nova Prova'}
        </Typography>

        {/* Form Fields */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 4 }}>
          <TextField
            label="Nome da Prova"
            placeholder="Ex: Prova de Biologia - Unidade 1"
            {...register('nome')}
            error={!!errors.nome}
            helperText={errors.nome?.message}
            fullWidth
          />

          <TextField
            label="Disciplina"
            placeholder="Ex: Biologia"
            {...register('disciplina')}
            error={!!errors.disciplina}
            helperText={errors.disciplina?.message}
            fullWidth
          />

          <TextField
            label="Professor"
            placeholder="Ex: Dr. João Silva"
            {...register('professor')}
            error={!!errors.professor}
            helperText={errors.professor?.message}
            fullWidth
          />

          <TextField
            label="Turma"
            placeholder="Ex: 3º A"
            {...register('turma')}
            error={!!errors.turma}
            helperText={errors.turma?.message}
            fullWidth
          />

          <TextField
            label="Data"
            type="date"
            {...register('data')}
            error={!!errors.data}
            helperText={errors.data?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth error={!!errors.identificacao}>
            <FormLabel sx={{ mb: 1 }}>Tipo de Identificação</FormLabel>
            <Controller
              name="identificacao"
              control={control}
              render={({ field }) => (
                <Select {...field} size="small">
                  <MenuItem value="LETRAS">Letras (A, B, C, D, E)</MenuItem>
                  <MenuItem value="POTENCIAS_DE_2">Potências de 2 (1, 2, 4, 8, 16)</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Box>

        {/* Questões Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Selecionar 5 Questões ({questoesIds.length}/5)
          </Typography>

          {errors.questoes && <Alert severity="error" sx={{ mb: 2 }}>{errors.questoes.message}</Alert>}

          {questoes.length === 0 ? (
            <Alert severity="info">Nenhuma questão disponível. Crie questões primeiro!</Alert>
          ) : (
            <Box sx={{ display: 'grid', gap: 2, maxHeight: 400, overflowY: 'auto' }}>
              {questoes.map((questao) => (
                <Card
                  key={questao.id}
                  sx={{
                    p: 2,
                    backgroundColor: questoesIds.includes(questao.id) ? '#e3f2fd' : '#fff',
                    borderLeft: questoesIds.includes(questao.id) ? '4px solid #1976d2' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Controller
                      name="questoes"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox
                          checked={value.includes(questao.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (value.length < 5) {
                                onChange([...value, questao.id]);
                              }
                            } else {
                              onChange(value.filter((id) => id !== questao.id));
                            }
                          }}
                          disabled={questoesIds.length >= 5 && !questoesIds.includes(questao.id)}
                          sx={{ mt: 0.5, flex: 'none' }}
                        />
                      )}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {questao.enunciado}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {questao.alternativas.length} alternativas
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Selecionadas Preview */}
        {questoesSelecionadas.length > 0 && (
          <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
              Questões Selecionadas:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {questoesSelecionadas.map((q, idx) => (
                <Box
                  key={q.id}
                  sx={{
                    backgroundColor: '#667eea',
                    color: '#fff',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  {idx + 1}. {q.enunciado.substring(0, 30)}...
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textTransform: 'none',
            fontWeight: 'bold',
            py: 1.5,
            px: 4,
          }}
        >
          {isLoading ? 'Salvando...' : prova ? 'Atualizar Prova' : 'Criar Prova'}
        </Button>
      </Paper>
    </motion.div>
  );
};
