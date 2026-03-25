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
  LinearProgress,
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  PlayArrow as GenerateIcon,
  FileDownload as FileIcon,
  Archive as ArchiveIcon,
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGerarProvas = async () => {
    if (!id) return;

    if (quantidade < 1 || quantidade > 1000) {
      showToast('Quantidade deve estar entre 1 e 1000', 'error');
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      showToast(`⏳ Gerando ${quantidade} provas individuais...`, 'info');
      
      const response = await fetch(`/api/provas/${id}/gerar-individuais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setProvasGeradas(data.quantidade);
      setGenerationProgress(100);
      
      showToast(`✅ ${data.quantidade} provas individuais geradas com sucesso!`, 'success');
      
      // Carregar estatísticas
      await loadStats();
      
      // Delay para mostrar 100%
      setTimeout(() => {
        setShowDialogDownload(true);
      }, 500);
    } catch (error: any) {
      showToast(error.message || 'Erro ao gerar provas', 'error');
      setGenerationProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadStats = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/provas/${id}/estatisticas`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleDownloadZip = async () => {
    if (!id || provasGeradas === 0) return;

    try {
      setIsDownloading(true);
      setDownloadProgress(10);
      showToast('📦 Preparando download do ZIP...', 'info');
      
      setDownloadProgress(30);
      const response = await fetch(`/api/provas/${id}/pdfs.zip`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setDownloadProgress(70);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `provas-${id}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setDownloadProgress(100);
      showToast('✅ ZIP baixado com sucesso!', 'success');
      
      setTimeout(() => {
        setShowDialogDownload(false);
        setDownloadProgress(0);
      }, 500);
    } catch (error: any) {
      showToast('❌ Erro ao baixar ZIP', 'error');
      setDownloadProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDFs = async () => {
    if (!id || provasGeradas === 0) return;

    try {
      setIsDownloading(true);
      const totalToDownload = Math.min(provasGeradas, 5);
      showToast(`📥 Baixando ${totalToDownload} PDFs...`, 'info');
      
      for (let i = 1; i <= totalToDownload; i++) {
        setDownloadProgress(Math.round((i / totalToDownload) * 100));
        
        const response = await fetch(`/api/provas/${id}/pdf/${i}`);
        if (!response.ok) {
          console.warn(`Erro ao baixar PDF ${i}`);
          continue;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prova-${i}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Pequeno delay entre downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setDownloadProgress(100);
      
      if (provasGeradas > 5) {
        showToast(`✅ ${totalToDownload} PDFs baixados! Use ZIP para todos os ${provasGeradas}`, 'success');
      } else {
        showToast('✅ PDFs baixados com sucesso!', 'success');
      }
      
      setTimeout(() => {
        setShowDialogDownload(false);
        setDownloadProgress(0);
      }, 500);
    } catch (error: any) {
      showToast('❌ Erro ao baixar PDFs', 'error');
      setDownloadProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadCSV = async () => {
    if (!id) return;

    try {
      setIsDownloading(true);
      setDownloadProgress(10);
      showToast('📥 Baixando gabarito...', 'info');
      
      setDownloadProgress(50);
      const response = await fetch(`/api/provas/${id}/gabarito.csv`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setDownloadProgress(80);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gabarito-${id}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setDownloadProgress(100);
      showToast('✅ Gabarito baixado!', 'success');
      
      setTimeout(() => {
        setShowDialogDownload(false);
        setDownloadProgress(0);
      }, 500);
    } catch (error: any) {
      showToast('❌ Erro ao baixar gabarito', 'error');
      setDownloadProgress(0);
    } finally {
      setIsDownloading(false);
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
                  disabled={isGenerating}
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

              {isGenerating && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      Gerando {quantidade} provas...
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      }}
                    />
                  </Box>
                </Box>
              )}

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
        <DialogTitle>📥 Opções de Download</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            ✅ {provasGeradas} provas individuais geradas com sucesso!
          </Typography>
          
          {stats && (
            <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  📊 Estatísticas
                </Typography>
                <Typography variant="caption">
                  Total gerado: <strong>{stats.total}</strong> provas
                </Typography>
              </CardContent>
            </Card>
          )}

          {downloadProgress > 0 && isDownloading && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                  Processando...
                </Typography>
                <Typography variant="caption">{downloadProgress}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={downloadProgress} sx={{ height: 6, borderRadius: 3 }} />
            </Box>
          )}
          
          <Typography sx={{ mb: 2, fontSize: '0.9rem', color: '#666' }}>
            Escolha uma opção abaixo:
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', gap: 1, p: 2 }}>
          <Button 
            fullWidth
            onClick={handleDownloadZip}
            disabled={isDownloading}
            variant="contained"
            startIcon={isDownloading ? <CircularProgress size={20} /> : <ArchiveIcon />}
            sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)' }}
          >
            📦 Baixar em ZIP (Recomendado)
          </Button>
          
          <Button 
            fullWidth
            onClick={handleDownloadPDFs}
            disabled={isDownloading || provasGeradas === 0}
            variant="outlined"
            startIcon={isDownloading ? <CircularProgress size={20} /> : <DownloadIcon />}
            sx={{ mt: 1 }}
          >
            📄 Baixar PDFs Individuais
          </Button>
          
          <Button 
            fullWidth
            onClick={handleDownloadCSV}
            disabled={isDownloading}
            variant="outlined"
            startIcon={<FileIcon />}
            sx={{ mt: 1 }}
          >
            📋 Baixar Gabarito (CSV)
          </Button>
          
          <Button 
            fullWidth
            onClick={() => setShowDialogDownload(false)}
            sx={{ mt: 2 }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
