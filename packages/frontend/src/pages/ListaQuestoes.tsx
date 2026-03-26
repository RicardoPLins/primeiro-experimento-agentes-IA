import { FC, useState } from 'react';
import { useQuestoes, useDeletarQuestao } from '../hooks/useQuestoes';
import { useUiStore } from '../store/uiStore';
import { useNavigate } from 'react-router-dom';
import { QuestaoCard } from '../components/QuestaoCard';
import {
  Box,
  Button,
  Container,
  TextField,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  LibraryBooks as BookOpenIcon,
  ViewAgendaOutlined as ListIcon,
  ViewComfyOutlined as GridIcon,
  Add as PlusIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

export const ListaQuestoes: FC = () => {
  const { data: questoes, isLoading } = useQuestoes();
  const deletarMutation = useDeletarQuestao();
  const showToast = useUiStore((s) => s.showToast);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');
  const [view, setView] = useState<number>(0);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que quer deletar?')) {
      try {
        await deletarMutation.mutateAsync(id);
        showToast('Questão deletada!', 'success');
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro ao deletar';
        showToast(mensagem, 'error');
      }
    }
  };

  const filtradas = (questoes || []).filter((q) =>
    q.enunciado.toLowerCase().includes(filtro.toLowerCase())
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
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <BookOpenIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Questões
                </Typography>
              </Box>
              <Typography color="textSecondary">
                Total: <strong>{filtradas.length}</strong> questão{filtradas.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => navigate('/questoes/nova')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1.5,
                px: 3,
              }}
            >
              Nova Questão
            </Button>
          </Box>
        </motion.div>

        {/* Filters & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper
            sx={{
              p: 2.5,
              mb: 4,
              display: 'flex',
              gap: 2,
              alignItems: 'flex-end',
              boxShadow: 2,
            }}
          >
            <TextField
              label="Buscar questões"
              placeholder="Digite o enunciado..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <Tabs
              value={view}
              onChange={(_, newValue) => setView(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 'auto',
                },
              }}
            >
              <Tab icon={<GridIcon sx={{ mr: 1 }} />} label="Grid" />
              <Tab icon={<ListIcon sx={{ mr: 1 }} />} label="Lista" />
            </Tabs>
          </Paper>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography color="textSecondary">Carregando questões...</Typography>
            </Box>
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && filtradas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Paper
                sx={{
                  textAlign: 'center',
                  p: 4,
                  maxWidth: 400,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h2" sx={{ mb: 2 }}>
                  📚
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {filtro ? 'Nenhuma questão encontrada' : 'Nenhuma questão criada'}
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 3 }}>
                  {filtro
                    ? 'Tente ajustar seus critérios de busca'
                    : 'Comece criando sua primeira questão'}
                </Typography>
                {!filtro && (
                  <Button
                    variant="contained"
                    startIcon={<PlusIcon />}
                    onClick={() => navigate('/questoes/nova')}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Criar Questão
                  </Button>
                )}
              </Paper>
            </Box>
          </motion.div>
        )}

        {/* Grid View */}
        {!isLoading && view === 0 && filtradas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {filtradas.map((questao, idx) => (
                <Box key={questao.id}>
                  <QuestaoCard
                    questao={questao}
                    index={idx}
                    onEdit={(id) => navigate(`/questoes/${id}/editar`)}
                    onDelete={handleDelete}
                  />
                </Box>
              ))}
            </Box>
          </motion.div>
        )}

        {/* List View */}
        {!isLoading && view === 1 && filtradas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <List sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: 2 }}>
              {filtradas.map((questao, idx) => (
                <motion.div
                  key={questao.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          size="small"
                          onClick={() => navigate(`/questoes/${questao.id}/editar`)}
                          sx={{ color: '#667eea' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          size="small"
                          onClick={() => handleDelete(questao.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                    divider={idx < filtradas.length - 1}
                    sx={{
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemText
                      primary={`Questão ${idx + 1}`}
                      secondary={questao.enunciado}
                      sx={{
                        '& .MuiListItemText-secondary': {
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        },
                      }}
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};
