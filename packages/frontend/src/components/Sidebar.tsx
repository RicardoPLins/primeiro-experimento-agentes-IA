import { FC } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Printer, CheckSquare, BarChart3, Home } from 'lucide-react';

export const Sidebar: FC = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Questões', path: '/questoes' },
    { icon: FileText, label: 'Provas', path: '/provas' },
    { icon: Printer, label: 'Gerar PDF', path: '/pdf/1' },
    { icon: CheckSquare, label: 'Correção', path: '/correcao' },
    { icon: BarChart3, label: 'Relatório', path: '/relatorio' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          📝 Provas
        </h1>
        <p className="text-sm text-gray-400 mt-1">Gerenciador completo</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 group"
            >
              <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-500">
          v1.0.0 • Sprint 2 em progresso
        </p>
      </div>
    </aside>
  );
};
