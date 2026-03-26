import { FC, useState } from 'react';
import { useProvas, useDeletarProva } from '../hooks/useProvas';
import { useUiStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Description as FileTextIcon,
  Add as PlusIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export const ListaProvas: FC = () => {
  const { data: provas, isLoading } = useProvas();
  const deletarMutation = useDeletarProva();
  const showToast = useUiStore((s) => s.showToast);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que quer deletar?')) {
      try {
        await deletarMutation.mutateAsync(id);
        showToast('Prova deletada!', 'success');
      } catch {
        showToast('Erro ao deletar', 'error');
      }
    }
  };

  const filtradas = (provas || []).filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    p.disciplina.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <FileTextIcon sx={{ fontSize: 24 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Provas
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => navigate('/provas/nova')}
              sx={{
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1.5,
                px: 3,
              }}
            >
              Nova Prova
            </Button>
          </Box>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper sx={{ mb: 4, p: 2.5, boxShadow: 2 }}>
            <TextField
              label="Buscar provas"
              placeholder="Digite o nome ou disciplina..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Paper>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography color="textSecondary">Carregando provas...</Typography>
            </Box>
          </Box>
        )}

        {/* Provas Grid */}
        {!isLoading && filtradas.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {filtradas.map((prova, idx) => (
              <motion.div
                key={prova.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {prova.nome}
                    </Typography>

                    <Box sx={{ space: 1.5, mb: 3 }}>
                      <Box sx={{ mb: 1 }}>
                        <Chip label={`📚 ${prova.disciplina}`} size="small" sx={{ mr: 1, mb: 1 }} />
                        <Chip label={`👨‍🏫 ${prova.professor}`} size="small" sx={{ mb: 1 }} />
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        🎓 Turma {prova.turma}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        📅 {new Date(prova.data).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ❓ {prova.questoes.length} questões
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ gap: 1, pt: 0 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/provas/${prova.id}`)}
                      sx={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        textTransform: 'none',
                      }}
                    >
                      Visualizar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/provas/${prova.id}/editar`)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(prova.id)}
                      sx={{
                        flex: 1,
                        textTransform: 'none',
                      }}
                    >
                      Deletar
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && filtradas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
              <Paper sx={{ textAlign: 'center', p: 4, maxWidth: 400, boxShadow: 2 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  📄
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Nenhuma prova encontrada
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 3 }}>
                  {filtro
                    ? 'Tente ajustar seus critérios de busca'
                    : 'Comece criando sua primeira prova'}
                </Typography>
                {!filtro && (
                  <Button
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => navigate('/provas/nova')}
                    sx={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                    }}
                  >
                    Criar Primeira Prova
                  </Button>
                )}
              </Paper>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};
