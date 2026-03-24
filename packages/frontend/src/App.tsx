import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/**
 * Componente raiz da aplicação
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Bem-vindo ao Gerenciador de Provas</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
