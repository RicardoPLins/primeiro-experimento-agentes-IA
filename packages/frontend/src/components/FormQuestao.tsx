import { FC, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Questao } from '@gerenciador-provas/shared';
import { useCriarQuestao, useAtualizarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';
import {
  TextField,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Alert as MuiAlert,
  CircularProgress,
  Chip,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Check, Info as InfoIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const questaoSchema = z.object({
  enunciado: z.string().min(10, 'Mínimo 10 caracteres').max(500, 'Máximo 500 caracteres'),
  tipoIdentificacao: z.enum(['LETRAS', 'POTENCIAS_DE_2']),
  alternativas: z.array(
    z.object({
      descricao: z.string().min(1, 'Descrição obrigatória').max(200, 'Máximo 200 caracteres'),
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
  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm<FormQuestaoData>({
    resolver: zodResolver(questaoSchema),
    mode: 'onChange',
    defaultValues: {
      enunciado: questao?.enunciado || '',
      tipoIdentificacao: questao?.tipoIdentificacao || 'LETRAS',
      alternativas: questao?.alternativas || Array(5).fill(null).map(() => ({ descricao: '', isCorreta: false })),
    },
  });

  // Reset form quando questão mudar
  useEffect(() => {
    if (questao) {
      reset({
        enunciado: questao.enunciado,
        tipoIdentificacao: questao.tipoIdentificacao || 'LETRAS',
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
      
      reset(); // Limpar formulário após sucesso
      onSuccess?.();
    } catch (err: any) {
      console.error('Erro:', err);
      const mensagem = err?.response?.data?.message || err?.message || 'Erro ao salvar questão';
      showToast(`❌ ${mensagem}`, 'error');
    }
  };

  const isLoading = criarMutation.isPending || atualizarMutation?.isPending;
  const hasErrors = Object.keys(errors).length > 0;
  const isValid = corretasCount > 0 && alternativasPreenchidas === 5 && enunciado.length >= 10 && !hasErrors;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 800, mx: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <MuiCard sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {questao ? '✏️ Editar Questão' : '✨ Criar Nova Questão'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {questao
                  ? 'Atualize os dados da questão'
                  : 'Preencha todos os campos para criar uma nova questão'}
              </Typography>
            </motion.div>

            {/* Error Alert */}
            {hasErrors && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MuiAlert severity="error" sx={{ mb: 3 }}>
                  Verifique os campos em vermelho
                </MuiAlert>
              </motion.div>
            )}

            {/* Enunciado */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Controller
                name="enunciado"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Enunciado da Questão"
                    placeholder="Digite o enunciado da questão aqui..."
                    error={!!errors.enunciado}
                    helperText={
                      errors.enunciado?.message || `${enunciado?.length || 0}/500 caracteres`
                    }
                    inputProps={{ maxLength: 500 }}
                    sx={{ mb: 3 }}
                  />
                )}
              />
            </motion.div>

            {/* Tipo de Identificação */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Controller
                name="tipoIdentificacao"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Tipo de Identificação</InputLabel>
                    <Select
                      {...field}
                      label="Tipo de Identificação"
                      error={!!errors.tipoIdentificacao}
                    >
                      <MenuItem value="LETRAS">Letras (A, B, C, D, E)</MenuItem>
                      <MenuItem value="POTENCIAS_DE_2">Potências de 2 (1, 2, 4, 8, 16)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </motion.div>

            {/* Alternativas Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Alternativas
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                  label={`Corretas: ${corretasCount}`}
                  color={corretasCount > 0 ? 'success' : 'warning'}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Preenchidas: ${alternativasPreenchidas}/5`}
                  color={alternativasPreenchidas === 5 ? 'success' : 'warning'}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>

            {/* Alternativas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {alternativas?.map((alt, idx) => {
                  const letra = String.fromCharCode(65 + idx);
                  const temErro = !!errors.alternativas?.[idx]?.descricao;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: temErro
                            ? '#fee'
                            : alt.isCorreta
                            ? '#efe'
                            : '#f9f9f9',
                          borderLeft: `4px solid ${
                            temErro ? '#d32f2f' : alt.isCorreta ? '#2e7d32' : '#bdbdbd'
                          }`,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          {/* Label Badge (Letter) */}
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              flexShrink: 0,
                            }}
                          >
                            {letra}
                          </Box>

                          {/* Alternativa Input */}
                          <Box sx={{ flex: 1 }}>
                            <Controller
                              name={`alternativas.${idx}.descricao`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  fullWidth
                                  size="small"
                                  placeholder={`Alternativa ${letra}`}
                                  error={temErro}
                                  helperText={errors.alternativas?.[idx]?.descricao?.message}
                                  inputProps={{ maxLength: 200 }}
                                />
                              )}
                            />
                          </Box>

                          {/* Checkbox Correta */}
                          <Box sx={{ flexShrink: 0, pt: 1 }}>
                            <Controller
                              name={`alternativas.${idx}.isCorreta`}
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      {...field}
                                      color="success"
                                      icon={<InfoIcon fontSize="small" />}
                                      checkedIcon={<Check fontSize="small" />}
                                    />
                                  }
                                  label={alt.isCorreta ? 'Correta ✅' : 'Correta'}
                                  sx={{
                                    color: alt.isCorreta ? '#2e7d32' : 'textSecondary',
                                    fontWeight: alt.isCorreta ? 'bold' : 'normal',
                                  }}
                                />
                              )}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  );
                })}
              </Box>
            </motion.div>

            {/* Validation Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: isValid ? '#e8f5e9' : '#e3f2fd',
                  borderLeft: `4px solid ${isValid ? '#2e7d32' : '#1976d2'}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {isValid ? (
                    <Check sx={{ color: '#2e7d32', flexShrink: 0, mt: 0.5 }} />
                  ) : (
                    <InfoIcon sx={{ color: '#1976d2', flexShrink: 0, mt: 0.5 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Checklist de Validação
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                      <Typography
                        component="li"
                        variant="body2"
                        sx={{
                          color: enunciado.length >= 10 ? '#2e7d32' : '#666',
                          mb: 0.5,
                        }}
                      >
                        {enunciado.length >= 10 ? '✅' : '⏳'} Enunciado preenchido (
                        {enunciado.length}/10)
                      </Typography>
                      <Typography
                        component="li"
                        variant="body2"
                        sx={{
                          color: alternativasPreenchidas === 5 ? '#2e7d32' : '#666',
                          mb: 0.5,
                        }}
                      >
                        {alternativasPreenchidas === 5 ? '✅' : '⏳'} Todas as 5 alternativas (
                        {alternativasPreenchidas}/5)
                      </Typography>
                      <Typography
                        component="li"
                        variant="body2"
                        sx={{
                          color: corretasCount > 0 ? '#2e7d32' : '#666',
                        }}
                      >
                        {corretasCount > 0 ? '✅' : '⏳'} Pelo menos 1 alternativa correta (
                        {corretasCount})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <MuiButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !isValid}
                sx={{
                  background: isValid
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#ccc',
                  color: '#fff',
                  fontWeight: 'bold',
                  py: 1.5,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : questao ? (
                  '💾 Atualizar Questão'
                ) : (
                  '✨ Criar Questão'
                )}
              </MuiButton>
            </motion.div>
          </CardContent>
        </MuiCard>
      </motion.div>
    </Box>
  );
};
