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
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
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
              <Route path="/pdf/:id" element={<div className="p-6">🖨️ Gerador de PDF em desenvolvimento</div>} />
              <Route path="/correcao" element={<div className="p-6">✅ Motor de Correção em desenvolvimento</div>} />
              <Route path="/relatorio" element={<div className="p-6">📊 Relatórios em desenvolvimento</div>} />
            </Routes>
          </main>
        </div>
        <Toast />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
