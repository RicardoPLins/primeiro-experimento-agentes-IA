import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Box } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { ListaQuestoes } from './pages/ListaQuestoes';
import { CriarEditarQuestao } from './pages/CriarEditarQuestao';
import { ListaProvas } from './pages/ListaProvas';
import { CriarEditarProva } from './pages/CriarEditarProva';
import { VisualizarProva } from './pages/VisualizarProva';
import { ProvaIndividualPage } from './pages/ProvaIndividualPage';
import { GerarProvasIndividuaisPage } from './pages/GerarProvasIndividuaisPage';
import { CorrecaoPage } from './pages/CorrecaoPage';
import { ResultadoCorrecaoPage } from './pages/ResultadoCorrecaoPage';

const queryClient = new QueryClient();

/**
 * Componente raiz da aplicação
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flex: 1,
              overflowY: 'auto',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              minHeight: '100vh',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Questões */}
              <Route path="/questoes" element={<ListaQuestoes />} />
              <Route path="/questoes/nova" element={<CriarEditarQuestao />} />
              <Route path="/questoes/:id/editar" element={<CriarEditarQuestao />} />
              
              {/* Provas */}
              <Route path="/provas" element={<ListaProvas />} />
              <Route path="/provas/nova" element={<CriarEditarProva />} />
              <Route path="/provas/:id" element={<VisualizarProva />} />
              <Route path="/provas/:id/editar" element={<CriarEditarProva />} />
              <Route path="/provas/:id/gerar-individuais" element={<GerarProvasIndividuaisPage />} />
              <Route path="/prova-individual/:id" element={<ProvaIndividualPage />} />
              
              {/* Correção */}
              <Route path="/correcao" element={<CorrecaoPage />} />
              <Route path="/resultado-correcao" element={<ResultadoCorrecaoPage />} />
              
              {/* Seções em desenvolvimento */}
              <Route
                path="/pdf/:id"
                element={
                  <Box
                    sx={{
                      p: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ fontSize: '4rem', mb: 2 }}>🖨️</Box>
                      <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', mb: 1 }}>
                        Gerador de PDF
                      </Box>
                      <Box sx={{ color: '#666' }}>
                        Esta funcionalidade está em desenvolvimento
                      </Box>
                    </Box>
                  </Box>
                }
              />
              <Route
                path="/correcao"
                element={<CorrecaoPage />}
              />
              <Route
                path="/relatorio"
                element={
                  <Box
                    sx={{
                      p: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ fontSize: '4rem', mb: 2 }}>📊</Box>
                      <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', mb: 1 }}>
                        Relatórios
                      </Box>
                      <Box sx={{ color: '#666' }}>
                        Esta funcionalidade está em desenvolvimento
                      </Box>
                    </Box>
                  </Box>
                }
              />
            </Routes>
          </Box>
        </Box>
        <Toast />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
