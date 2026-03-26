import { FC } from 'react';
import { Box, Container, Paper, Typography, Alert } from '@mui/material';
import { motion } from 'framer-motion';

export const ProvaIndividualPage: FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              📋 Criar Instância de Prova
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 3 }}>
              Esta funcionalidade permite embaralhar questões e alternativas para criar variantes individuais de uma prova.
            </Typography>
            <Alert severity="info" sx={{ textTransform: 'none' }}>
              ⏳ Em desenvolvimento - voltaremos aqui após implementar PDF com embaralhamento
            </Alert>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};
