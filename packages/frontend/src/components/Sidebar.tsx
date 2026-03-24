import { FC } from 'react';
import { Link } from 'react-router-dom';

export const Sidebar: FC = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">📝 Gerenciador de Provas</h1>
      
      <nav className="space-y-2">
        <Link
          to="/questoes"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          ❓ Questões
        </Link>
        <Link
          to="/provas"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          📄 Provas
        </Link>
        <Link
          to="/pdf"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          🖨️ Gerar PDF
        </Link>
        <Link
          to="/correcao"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          ✅ Correção
        </Link>
        <Link
          to="/relatorio"
          className="block px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          📊 Relatório
        </Link>
      </nav>
    </aside>
  );
};
