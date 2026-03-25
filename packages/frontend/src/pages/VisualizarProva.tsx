import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProva } from '../hooks/useProvas';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  CreateNewFolder as CreateNewFolderIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export const VisualizarProva: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: prova, isLoading } = useProva(id);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!prova) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error" variant="h6">
          Prova não encontrada
        </Typography>
      </Box>
    );
  }

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('pt-BR');
  const identificacaoLabel = prova.identificacao === 'LETRAS' ? '(A, B, C, D, E)' : '(1, 2, 4, 8, 16)';
  const totalAlternativas = prova.questoes.reduce((sum, q) => sum + q.alternativas.length, 0);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
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

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper sx={{ p: 4, mb: 4, boxShadow: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {prova.nome}
                </Typography>
                <Typography color="textSecondary" variant="h6">
                  {prova.disciplina}
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatDate(prova.data)}
                </Typography>
                <Typography color="textSecondary">Turma {prova.turma}</Typography>
              </Box>
            </Box>

            {/* Stats */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 2,
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Professor
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {prova.professor}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Questões
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {prova.questoes.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Identificação
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {identificacaoLabel}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Total Alternativas
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {totalAlternativas}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/provas/${prova.id}/editar`)}
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                onClick={() => navigate(`/pdf/${prova.id}`)}
                sx={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Gerar PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<CreateNewFolderIcon />}
                onClick={() => navigate(`/prova-individual/${prova.id}`)}
                sx={{
                  background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Criar Instância
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Questions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              📝 Questões da Prova
            </Typography>

            <Box sx={{ width: '100%' }}>
              {prova.questoes.map((questao, idx) => (
                <motion.div
                  key={questao.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <Card sx={{ mb: 2, '&:hover': { boxShadow: 2 } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            flex: 'none',
                          }}
                        >
                          {idx + 1}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
                          {questao.enunciado}
                        </Typography>
                      </Box>

                      <Box sx={{ ml: 5 }}>
                        {questao.alternativas.map((alt, altIdx) => (
                          <Box
                            key={alt.id}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              borderRadius: 1,
                              backgroundColor: alt.isCorreta ? '#e8f5e9' : '#f5f5f5',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 1,
                            }}
                          >
                            <Typography sx={{ fontWeight: 'bold', flex: 'none' }}>
                              {String.fromCharCode(65 + altIdx)}){' '}
                            </Typography>
                            <Typography sx={{ flex: 1 }}>{alt.descricao}</Typography>
                            {alt.isCorreta && <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 20 }} />}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};
