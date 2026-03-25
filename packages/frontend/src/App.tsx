import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { ListaQuestoes } from './pages/ListaQuestoes';
import { CriarEditarQuestao } from './pages/CriarEditarQuestao';
import { ListaProvas } from './pages/ListaProvas';
import { CriarEditarProva } from './pages/CriarEditarProva';
import { VisualizarProva } from './pages/VisualizarProva';
import { ProvaIndividualPage } from './pages/ProvaIndividualPage';

const queryClient = new QueryClient();

/**
 * Componente raiz da aplicação
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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
              <Route path="/prova-individual/:id" element={<ProvaIndividualPage />} />
              
              {/* Seções em desenvolvimento */}
              <Route
                path="/pdf/:id"
                element={
                  <div className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🖨️</div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Gerador de PDF
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Esta funcionalidade está em desenvolvimento
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="/correcao"
                element={
                  <div className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4">✅</div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Motor de Correção
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Esta funcionalidade está em desenvolvimento
                      </p>
                    </div>
                  </div>
                }
              />
              <Route
                path="/relatorio"
                element={
                  <div className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Relatórios
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Esta funcionalidade está em desenvolvimento
                      </p>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
        <Toast />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
