import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Stack,
  TextField,
  Divider,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Download as DownloadIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useCorrecao } from '../hooks/useCorrecao';
import { ModoCorrecao } from '@gerenciador-provas/shared';

export const CorrecaoPage = () => {
  const [gabaritoFile, setGabaritoFile] = useState<File | null>(null);
  const [respostasFile, setRespostasFile] = useState<File | null>(null);
  const [provaId, setProvaId] = useState<string>('');
  const [modo, setModo] = useState<ModoCorrecao>('RIGOROSA');
  const [selectedRelatorio, setSelectedRelatorio] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const {
    corrigir,
    listarRelatorios,
    obterEstatisticas,
    exportarCSV,
    isLoading,
    error,
    success,
  } = useCorrecao();

  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [estatisticas, setEstatisticas] = useState<any | null>(null);

  const handleGabaritoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setGabaritoFile(e.target.files[0]);
    }
  };

  const handleRespostasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setRespostasFile(e.target.files[0]);
    }
  };

  const handleCorrigir = async () => {
    if (!provaId.trim()) {
      alert('Digite o ID da Prova');
      return;
    }
    if (!gabaritoFile) {
      alert('Selecione o arquivo do Gabarito');
      return;
    }
    if (!respostasFile) {
      alert('Selecione o arquivo de Respostas');
      return;
    }

    const resultado = await corrigir(provaId, gabaritoFile, respostasFile, modo);

    if (resultado) {
      // Recarregar dados
      const dados = await listarRelatorios();
      if (dados) {
        setRelatorios(dados.relatorios);
      }

      const dadosEstat = await obterEstatisticas();
      if (dadosEstat) {
        setEstatisticas(dadosEstat.estatisticas);
      }

      // Limpar formulário
      setGabaritoFile(null);
      setRespostasFile(null);
      setProvaId('');
    }
  };

  const handleVisualizarRelatorio = (relatorio: any) => {
    setSelectedRelatorio(relatorio);
    setOpenModal(true);
  };

  const handleExportarCSV = async () => {
    await exportarCSV();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRelatorio(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Título */}
      <Typography
        variant="h3"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        🎓 Sistema de Correção de Provas
      </Typography>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Section: Upload de Arquivos */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          📤 Upload de Arquivos
        </Typography>
        
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Card: Gabarito */}
          <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                📄 Arquivo de Gabarito
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Envie o CSV com as respostas corretas
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #667eea',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
                component="label"
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleGabaritoChange}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                <Typography variant="body2">
                  {gabaritoFile ? gabaritoFile.name : 'Clique ou arraste o arquivo'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Card: Respostas */}
          <Card sx={{ flex: 1, boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                📋 Arquivo de Respostas
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Envie o CSV com as respostas dos alunos
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #764ba2',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
                component="label"
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleRespostasChange}
                  style={{ display: 'none' }}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: '#764ba2', mb: 1 }} />
                <Typography variant="body2">
                  {respostasFile ? respostasFile.name : 'Clique ou arraste o arquivo'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Section: Configurações */}
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            ⚙️ Configurações
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="ID da Prova"
              value={provaId}
              onChange={(e) => setProvaId(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Digite o ID da prova"
            />

            <FormControl fullWidth>
              <InputLabel>Modo de Correção</InputLabel>
              <Select
                value={modo}
                onChange={(e) => setModo(e.target.value as ModoCorrecao)}
                label="Modo de Correção"
              >
                <MenuItem value="RIGOROSA">🔴 Rigorosa (Uma única resposta correta)</MenuItem>
                <MenuItem value="MENOS_RIGOROSA">🟡 Menos Rigorosa (Ordem pode variar)</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              startIcon={<CloudUploadIcon />}
              onClick={handleCorrigir}
              disabled={isLoading || !provaId || !gabaritoFile || !respostasFile}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 1.5,
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Processar Correção'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Section: Estatísticas */}
      {estatisticas && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            📊 Estatísticas Gerais
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" variant="body2">Total de Alunos</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  {estatisticas.totalAlunos}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" variant="body2">Média</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#764ba2' }}>
                  {estatisticas.media.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" variant="body2">Máximo</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#28a745' }}>
                  {estatisticas.maximo}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" variant="body2">Mínimo</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#dc3545' }}>
                  {estatisticas.minimo}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" variant="body2">Mediana</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ffc107' }}>
                  {estatisticas.mediana}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" variant="body2">Desvio Padrão</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#17a2b8' }}>
                  {estatisticas.desvio_padrao.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      )}

      {/* Section: Resultados */}
      {relatorios.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              📋 Relatórios de Correção ({relatorios.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportarCSV}
            >
              Exportar CSV
            </Button>
          </Stack>

          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acertos</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nota</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {relatorios.map((relatorio: any) => (
                  <TableRow key={relatorio._id} hover>
                    <TableCell>{relatorio.email}</TableCell>
                    <TableCell>{relatorio.nome}</TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 'bold', color: '#28a745' }}>
                        {relatorio.total_acertos} / {relatorio.total_questoes}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 'bold', fontSize: 16, color: '#667eea' }}>
                        {relatorio.nota.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleVisualizarRelatorio(relatorio)}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Modal: Detalhes do Relatório */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', background: '#f5f5f5' }}>
          📊 Detalhes da Correção
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedRelatorio && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="textSecondary">Email:</Typography>
                <Typography>{selectedRelatorio.email}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Nome:</Typography>
                <Typography>{selectedRelatorio.nome}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" color="textSecondary">Acertos:</Typography>
                <Typography sx={{ fontWeight: 'bold', color: '#28a745' }}>
                  {selectedRelatorio.total_acertos} de {selectedRelatorio.total_questoes}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Nota Final:</Typography>
                <Typography sx={{ fontWeight: 'bold', fontSize: 18, color: '#667eea' }}>
                  {selectedRelatorio.nota.toFixed(1)} / 10
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Modo de Correção:</Typography>
                <Typography>{selectedRelatorio.modo}</Typography>
              </Box>
              {selectedRelatorio.respostas && selectedRelatorio.respostas.length > 0 && (
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Respostas:</Typography>
                  <Typography variant="body2" component="div">
                    {selectedRelatorio.respostas.slice(0, 5).map((resp: any, idx: number) => (
                      <Box key={idx} sx={{ py: 0.5 }}>
                        Q{idx + 1}: {resp.acertou ? '✅' : '❌'} ({resp.resposta})
                      </Box>
                    ))}
                    {selectedRelatorio.respostas.length > 5 && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                        + {selectedRelatorio.respostas.length - 5} mais respostas...
                      </Typography>
                    )}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
