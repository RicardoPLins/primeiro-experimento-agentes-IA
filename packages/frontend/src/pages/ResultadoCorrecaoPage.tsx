import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import { RelatorioNotas } from '@gerenciador-provas/shared';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useRelatorios } from '../hooks/useRelatorios';

interface ResultadoCorrecaoState {
  relatorios: RelatorioNotas[];
  totalRelatorios: number;
  estatisticas: {
    media?: number;
    mediana?: number;
    desvio?: number;
    maximo?: number;
    minimo?: number;
  };
  modoCorrecao: string;
}

export const ResultadoCorrecaoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { salvarRelatorios } = useRelatorios();

  const state = location.state as ResultadoCorrecaoState;

  const { relatorios = [], estatisticas = {}, totalRelatorios = 0, modoCorrecao = '' } = state || {};

  // Salvar relatórios automaticamente ao carregar a página
  useEffect(() => {
    if (relatorios.length > 0) {
      salvarRelatorios(relatorios);
    }
  }, []);

  const handleVoltar = () => {
    navigate('/correcao');
  };

  const handleExportarCSV = () => {
    if (!relatorios.length) return;

    const linhas = ['Nome,CPF,Nota Final,Total Questões,Acertos'];

    for (const relatorio of relatorios) {
      const totalQuestoes = relatorio.notas.length;
      const acertos = relatorio.notas.filter((n) => n.nota > 0).length;

      linhas.push(`${relatorio.nome || 'N/A'},${relatorio.cpf || 'N/A'},${relatorio.notaFinal.toFixed(2)},${totalQuestoes},${acertos}`);
    }

    const csv = linhas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `resultados-correcao-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mediaGeral = useMemo(() => {
    if (relatorios.length === 0) return 0;
    return relatorios.reduce((sum, r) => sum + r.notaFinal, 0) / relatorios.length;
  }, [relatorios]);

  const getColorResultado = (nota: number) => {
    if (nota >= 70) return '#4caf50'; // Verde
    if (nota >= 50) return '#ff9800'; // Laranja
    return '#f44336'; // Vermelho
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleVoltar}
        >
          Voltar
        </Button>
        <Typography variant="h4" sx={{ flex: 1 }}>
          📊 Resultados da Correção
        </Typography>
        <Chip label={`Modo: ${modoCorrecao}`} color="primary" variant="outlined" />
      </Box>

      {/* Estatísticas Gerais */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Total de Alunos
            </Typography>
            <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
              {totalRelatorios}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Média Geral
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: getColorResultado(mediaGeral),
                fontWeight: 'bold',
              }}
            >
              {mediaGeral.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Nota Máxima
            </Typography>
            <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              {(estatisticas?.maximo || 0).toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Nota Mínima
            </Typography>
            <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 'bold' }}>
              {(estatisticas?.minimo || 0).toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Botão Exportar */}
      <Box sx={{ mb: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportarCSV}
          disabled={relatorios.length === 0}
        >
          Exportar CSV
        </Button>
      </Box>

      {/* Tabela de Resultados */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
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
              <TableCell sx={{ fontWeight: 'bold' }}>Progresso</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {relatorios.map((relatorio, idx) => {
              const totalQuestoes = relatorio.notas.length;
              const acertos = relatorio.notas.filter((n) => n.nota > 0).length;
              const porcentagem = totalQuestoes > 0 ? (acertos / totalQuestoes) * 100 : 0;

              return (
                <TableRow key={idx} hover>
                  <TableCell sx={{ fontWeight: '500' }}>{relatorio.nome || 'N/A'}</TableCell>
                  <TableCell>{relatorio.cpf || 'N/A'}</TableCell>
                  <TableCell align="center">{totalQuestoes}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {acertos}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      color: getColorResultado(relatorio.notaFinal),
                      fontSize: '1.1rem',
                    }}
                  >
                    {relatorio.notaFinal.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={porcentagem}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" sx={{ minWidth: 45, textAlign: 'right' }}>
                        {porcentagem.toFixed(0)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {relatorios.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography color="textSecondary">Nenhum resultado para exibir</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default ResultadoCorrecaoPage;
