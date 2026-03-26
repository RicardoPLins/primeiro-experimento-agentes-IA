import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Container,
  Stack,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useCorrecao } from '../hooks/useCorrecao';
import { ModoCorrecao } from '@gerenciador-provas/shared';

export const CorrecaoPage = () => {
  const navigate = useNavigate();
  const [gabaritoFile, setGabaritoFile] = useState<File | null>(null);
  const [respostasFile, setRespostasFile] = useState<File | null>(null);
  const [modo, setModo] = useState<ModoCorrecao>('RIGOROSA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { corrigir } = useCorrecao();

  const handleGabaritoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setGabaritoFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleRespostasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setRespostasFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleCorrigir = async () => {
    if (!gabaritoFile) {
      setError('Selecione o arquivo do Gabarito');
      return;
    }
    if (!respostasFile) {
      setError('Selecione o arquivo de Respostas');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resultado = await corrigir('', gabaritoFile, respostasFile, modo);

      if (resultado) {
        // Navegar para página de resultados
        navigate('/resultado-correcao', {
          state: {
            relatorios: resultado.relatorios || [],
            totalRelatorios: resultado.totalRelatorios || 0,
            estatisticas: resultado.estatisticas || {},
            modoCorrecao: modo,
          },
        });

        // Limpar formulário
        setGabaritoFile(null);
        setRespostasFile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao corrigir provas');
    } finally {
      setIsLoading(false);
    }
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

      {/* Section: Modo de Correção */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          ⚙️ Modo de Correção
        </Typography>
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  border: modo === 'RIGOROSA' ? '2px solid #667eea' : '2px solid #ddd',
                  borderRadius: 1,
                  cursor: 'pointer',
                  backgroundColor: modo === 'RIGOROSA' ? '#f0f3ff' : 'transparent',
                  transition: 'all 0.3s',
                }}
                onClick={() => setModo('RIGOROSA')}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🔴 Rigorosa
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tudo ou nada: resposta deve estar 100% correta
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  border: modo === 'MENOS_RIGOROSA' ? '2px solid #764ba2' : '2px solid #ddd',
                  borderRadius: 1,
                  cursor: 'pointer',
                  backgroundColor: modo === 'MENOS_RIGOROSA' ? '#f8f0ff' : 'transparent',
                  transition: 'all 0.3s',
                }}
                onClick={() => setModo('MENOS_RIGOROSA')}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🟢 Menos Rigorosa
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proporcional: pontuação varia conforme acertos
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Section: Botão Corrigir */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleCorrigir}
          disabled={isLoading || !gabaritoFile || !respostasFile}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
          }}
        >
          {isLoading ? '⏳ Processando...' : '✓ Corrigir Provas'}
        </Button>
      </Box>
    </Container>
  );
};

export default CorrecaoPage;
