import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Printer,
  CheckSquare,
  BarChart3,
  Home,
  Settings,
  HelpCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export const Sidebar: FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Questões', path: '/questoes' },
    { icon: FileText, label: 'Provas', path: '/provas' },
    { icon: Printer, label: 'Gerar PDF', path: '/pdf/1' },
    { icon: CheckSquare, label: 'Correção', path: '/correcao' },
    { icon: BarChart3, label: 'Relatório', path: '/relatorio' },
  ];

  const secondaryItems = [
    { icon: HelpCircle, label: 'Ajuda', path: '/help' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 text-white h-screen p-6 flex flex-col border-r border-gray-800 shadow-2xl">
      {/* Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Provas</h1>
            <p className="text-xs text-gray-400">Manager v1.0</p>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <motion.div key={item.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <Icon className={clsx('w-5 h-5 transition-colors relative z-10', isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400')} />
                <span className={clsx('text-sm font-medium relative z-10', isActive && 'font-semibold')}>
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-700 my-4" />

      {/* Secondary Navigation */}
      <nav className="space-y-1 mb-6">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                isActive ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-lg p-3 border border-blue-900">
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-blue-300">Dica:</strong> Use atalhos de teclado para navegar mais rápido entre seções.
        </p>
      </div>
    </aside>
  );
};
