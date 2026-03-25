import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormQuestao } from '../components/FormQuestao';
import { useQuestao } from '../hooks/useQuestoes';
import { motion } from 'framer-motion';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button as MuiButton, Container, CircularProgress, Typography } from '@mui/material';

export const CriarEditarQuestao: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: questao, isLoading } = useQuestao(id);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <MuiButton
            startIcon={<ArrowBack />}
            onClick={() => navigate('/questoes')}
            sx={{
              mb: 3,
              color: '#fff',
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Voltar para Questões
          </MuiButton>
        </motion.div>

        {/* Loading State */}
        {id && isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CircularProgress size={50} sx={{ mb: 2, color: '#667eea' }} />
              <Typography variant="body1" color="textSecondary">
                Carregando questão...
              </Typography>
            </Box>
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
      </Container>
    </Box>
  );
};
