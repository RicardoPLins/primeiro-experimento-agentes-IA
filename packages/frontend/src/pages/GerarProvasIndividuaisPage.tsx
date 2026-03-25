import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  PlayArrow as GenerateIcon,
  FileDownload as FileIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useProva } from '../hooks/useProvas';
import { useUiStore } from '../store/uiStore';

export const GerarProvasIndividuaisPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: prova, isLoading: isLoadingProva } = useProva(id);
  const showToast = useUiStore((s) => s.showToast);

  const [quantidade, setQuantidade] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [provasGeradas, setProvasGeradas] = useState(0);
  const [showDialogDownload, setShowDialogDownload] = useState(false);

  const handleGerarProvas = async () => {
    if (!id) return;

    if (quantidade < 1 || quantidade > 1000) {
      showToast('Quantidade deve estar entre 1 e 1000', 'error');
      return;
    }

    try {
      setIsGenerating(true);
      const response = await fetch(`/api/provas/${id}/gerar-individuais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setProvasGeradas(data.quantidade);
      showToast(`✅ ${data.quantidade} provas individuais geradas!`, 'success');
      setShowDialogDownload(true);
    } catch (error: any) {
      showToast(error.message || 'Erro ao gerar provas', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDFs = async () => {
    if (!id || provasGeradas === 0) return;

    try {
      showToast('Baixando PDFs...', 'info');
      // Implementar download de múltiplos PDFs
      // Por enquanto, fazer download de um por um
      for (let i = 1; i <= provasGeradas; i++) {
        const response = await fetch(`/api/provas/${id}/pdf/${i}`);
        if (!response.ok) continue;

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prova-${i}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      showToast('✅ PDFs baixados!', 'success');
    } catch (error: any) {
      showToast('Erro ao baixar PDFs', 'error');
    }
  };

  const handleDownloadCSV = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/provas/${id}/gabarito.csv`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gabarito-${id}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('✅ Gabarito baixado!', 'success');
      setShowDialogDownload(false);
    } catch (error: any) {
      showToast('Erro ao baixar gabarito', 'error');
    }
  };

  if (isLoadingProva) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!prova) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Prova não encontrada
        </Alert>
        <Button onClick={() => navigate('/provas')} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button onClick={() => navigate(`/provas/${id}`)} sx={{ mb: 3, color: '#fff' }}>
            ← Voltar
          </Button>

          <Card sx={{ boxShadow: 3, mb: 4 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                🎯 Gerar Provas Individuais
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Prova: <strong>{prova.nome}</strong>
              </Typography>

              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={`📚 ${prova.disciplina}`} />
                <Chip label={`👨‍🏫 ${prova.professor}`} />
                <Chip label={`❓ ${prova.questoes.length} questões`} />
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quantas provas individuais deseja gerar?
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseInt(e.target.value))}
                  inputProps={{ min: 1, max: 1000 }}
                  sx={{ width: 150 }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGerarProvas}
                  disabled={isGenerating}
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <GenerateIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Provas'}
                </Button>
              </Box>

              {provasGeradas > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  ✅ {provasGeradas} provas individuais geradas com sucesso!
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Dialog de Download */}
      <Dialog open={showDialogDownload} onClose={() => setShowDialogDownload(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Baixar Provas</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            {provasGeradas} provas individuais geradas. O que deseja fazer?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialogDownload(false)}>Cancelar</Button>
          <Button
            onClick={handleDownloadCSV}
            variant="contained"
            startIcon={<FileIcon />}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Baixar Gabarito CSV
          </Button>
          <Button
            onClick={handleDownloadPDFs}
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)' }}
          >
            Baixar PDFs
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
