import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { RelatorioNotas } from '@gerenciador-provas/shared';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRelatorios } from '../hooks/useRelatorios';

export const RelatoriosPage: React.FC = () => {
  const [relatorios, setRelatorios] = useState<RelatorioNotas[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRelatorio, setSelectedRelatorio] = useState<RelatorioNotas | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [relatorioParaDeletar, setRelatorioParaDeletar] = useState<string | null>(null);

  const { listarRelatorios, deletarRelatorio } = useRelatorios();

  const carregarRelatorios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dados = await listarRelatorios();
      if (dados) {
        setRelatorios(dados);
      }
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao carregar relatórios';
      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const handleVisualizarRelatorio = (relatorio: RelatorioNotas) => {
    setSelectedRelatorio(relatorio);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRelatorio(null);
  };

  const handleConfirmarDelecao = async () => {
    if (!relatorioParaDeletar) return;

    const sucesso = await deletarRelatorio(relatorioParaDeletar);
    if (sucesso) {
      setRelatorios((prev) => prev.filter((r) => r.id !== relatorioParaDeletar));
      setOpenDeleteConfirm(false);
      setRelatorioParaDeletar(null);
    }
  };

  const handleAbrirConfirmacao = (id: string) => {
    setRelatorioParaDeletar(id);
    setOpenDeleteConfirm(true);
  };

  const getColorNota = (nota: number) => {
    if (nota >= 70) return '#4caf50'; // Verde
    if (nota >= 50) return '#ff9800'; // Laranja
    return '#f44336'; // Vermelho
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          📊 Relatórios de Correção
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={carregarRelatorios}
          disabled={isLoading}
        >
          Atualizar
        </Button>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Tabela de Relatórios */}
      {!isLoading && relatorios.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CPF</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Nota Final
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Modo
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Data
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relatorios.map((relatorio) => (
                <TableRow key={relatorio.id} hover>
                  <TableCell sx={{ fontWeight: '500' }}>{relatorio.nome || 'N/A'}</TableCell>
                  <TableCell>{relatorio.cpf || 'N/A'}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      color: getColorNota(relatorio.notaFinal),
                      fontSize: '1rem',
                    }}
                  >
                    {relatorio.notaFinal.toFixed(2)}%
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={relatorio.modoCorrecao}
                      size="small"
                      color={relatorio.modoCorrecao === 'RIGOROSA' ? 'error' : 'success'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {new Date(relatorio.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleVisualizarRelatorio(relatorio)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleAbrirConfirmacao(relatorio.id)}
                      >
                        Deletar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isLoading && relatorios.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">Nenhum relatório encontrado</Typography>
        </Paper>
      )}

      {/* Modal: Visualizar Relatório */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Detalhes do Relatório</DialogTitle>
        <DialogContent>
          {selectedRelatorio && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Nome
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedRelatorio.nome || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">
                  CPF
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedRelatorio.cpf || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Nota Final
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 'bold', color: getColorNota(selectedRelatorio.notaFinal) }}
                >
                  {selectedRelatorio.notaFinal.toFixed(2)}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  Respostas por Questão
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedRelatorio.notas.map((nota, idx) => (
                    <Chip
                      key={idx}
                      label={`Q${idx + 1}: ${nota.nota > 0 ? '✅' : '❌'}`}
                      color={nota.nota > 0 ? 'success' : 'error'}
                      variant={nota.nota > 0 ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Modo de Correção
                </Typography>
                <Chip
                  label={selectedRelatorio.modoCorrecao}
                  color={selectedRelatorio.modoCorrecao === 'RIGOROSA' ? 'error' : 'success'}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Data
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedRelatorio.createdAt).toLocaleString('pt-BR')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal: Confirmar Deleção */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja deletar este relatório?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancelar</Button>
          <Button onClick={handleConfirmarDelecao} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RelatoriosPage;
