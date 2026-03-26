import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormProva } from '../components/FormProva';
import { useProva } from '../hooks/useProvas';
import { Box, Button, Container, CircularProgress, Typography } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

export const CriarEditarProva: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: prova, isLoading } = useProva(id);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/provas')}
            sx={{
              mb: 3,
              color: '#fff',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Voltar
          </Button>
        </motion.div>

        {isLoading && id ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2, color: '#fff' }} />
              <Typography sx={{ color: '#fff' }}>Carregando prova...</Typography>
            </Box>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FormProva
              prova={prova}
              onSuccess={() => navigate('/provas')}
            />
          </motion.div>
        )}
      </Container>
    </Box>
  );
};
