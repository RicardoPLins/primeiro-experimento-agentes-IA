import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Collapse,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface CorrecaoProcessada {
  id: string;
  nomeLote: string;
  dataProcessamento: string;
  modoCorrecao: string;
  totalAlunos: number;
  mediaGeral: number;
  notaMaxima: number;
  notaMinima: number;
  relatorios: Array<{
    nome: string;
    cpf: string;
    notaFinal: number;
    modo: string;
    acertos: number;
    totalQuestoes: number;
  }>;
}

export const CorrecoesProcesadasPage: React.FC = () => {
  const navigate = useNavigate();
  const [correcoes, setCorrecoes] = useState<CorrecaoProcessada[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string | null;
    nome: string;
  }>({
    open: false,
    id: null,
    nome: '',
  });
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const carregarCorrecoes = () => {
    setLoading(true);
    fetch('/api/correcao/processadas', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar');
        return res.json();
      })
      .then((data) => {
        setCorrecoes(data.correcoes || []);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Erro ao carregar correções processadas',
          severity: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    carregarCorrecoes();
  }, []);

  const handleVoltar = () => {
    navigate('/correcao');
  };

  const getColorResultado = (nota: number) => {
    if (nota >= 70) return '#4caf50'; // Verde
    if (nota >= 50) return '#ff9800'; // Laranja
    return '#f44336'; // Vermelho
  };

  const handleDelete = (id: string, nome: string) => {
    setDeleteDialog({
      open: true,
      id,
      nome,
    });
  };

  const confirmarDelete = () => {
    if (!deleteDialog.id) return;

    setDeleting(true);
    fetch(`/api/correcao/processadas/${deleteDialog.id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao deletar');
        setCorrecoes(correcoes.filter((c) => c.id !== deleteDialog.id));
        setSnackbar({
          open: true,
          message: 'Correção deletada com sucesso',
          severity: 'success',
        });
        setDeleteDialog({ open: false, id: null, nome: '' });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Erro ao deletar correção',
          severity: 'error',
        });
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleVoltar}>
          Voltar
        </Button>
        <Typography variant="h4" sx={{ flex: 1 }}>
          📁 Correções Processadas
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={carregarCorrecoes}
          disabled={loading}
        >
          Atualizar
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress />
        </Box>
      ) : correcoes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">Nenhuma correção processada ainda</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/correcao')}>
            Ir para Correção
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome do Lote</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Data Processamento</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Modo</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Alunos
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Média
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Máxima
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Mínima
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {correcoes.map((correcao) => (
                <React.Fragment key={correcao.id}>
                  <TableRow hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedId(expandedId === correcao.id ? null : correcao.id)
                          }
                        >
                          {expandedId === correcao.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDelete(correcao.id, correcao.nomeLote)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: '500' }}>{correcao.nomeLote}</TableCell>
                    <TableCell>
                      {new Date(correcao.dataProcessamento).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={correcao.modoCorrecao}
                        size="small"
                        variant="outlined"
                        color={correcao.modoCorrecao === 'RIGOROSA' ? 'error' : 'warning'}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                      {correcao.totalAlunos}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        color: getColorResultado(correcao.mediaGeral),
                      }}
                    >
                      {correcao.mediaGeral.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        color: '#4caf50',
                      }}
                    >
                      {correcao.notaMaxima.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        color: '#f44336',
                      }}
                    >
                      {correcao.notaMinima.toFixed(2)}%
                    </TableCell>
                  </TableRow>

                  {/* Tabela expandível com detalhes */}
                  <TableRow>
                    <TableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedId === correcao.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            Detalhes dos Alunos
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>CPF</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Total Questões
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Acertos
                                  </TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                    Nota Final
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {correcao.relatorios.map((rel, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{rel.nome || 'N/A'}</TableCell>
                                    <TableCell>{rel.cpf || 'N/A'}</TableCell>
                                    <TableCell align="center">{rel.totalQuestoes}</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                      {rel.acertos}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      sx={{
                                        fontWeight: 'bold',
                                        color: getColorResultado(rel.notaFinal),
                                      }}
                                    >
                                      {rel.notaFinal.toFixed(2)}%
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de confirmação de delete */}
      <Dialog open={deleteDialog.open} onClose={() => !deleting && setDeleteDialog({ open: false, id: null, nome: '' })}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja deletar a correção "{deleteDialog.nome}"? Esta ação não pode ser
            desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null, nome: '' })} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={confirmarDelete}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CorrecoesProcesadasPage;
