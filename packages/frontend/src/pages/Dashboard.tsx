import { FC, useMemo } from 'react';
import {
  BarChart3,
  BookOpen,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { StatCard, Card, Button } from '../components/ui';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Dashboard: FC = () => {
  const navigate = useNavigate();

  const stats = useMemo(
    () => [
      {
        label: 'Total de Questões',
        value: 0,
        icon: <BookOpen className="w-8 h-8" />,
        color: 'blue' as const,
        trend: 'neutral' as const,
      },
      {
        label: 'Provas Criadas',
        value: 0,
        icon: <FileText className="w-8 h-8" />,
        color: 'green' as const,
        trend: 'up' as const,
        trendValue: 'Sem dados',
      },
      {
        label: 'PDFs Gerados',
        value: 0,
        icon: <BarChart3 className="w-8 h-8" />,
        color: 'purple' as const,
        trend: 'neutral' as const,
      },
      {
        label: 'Correções Processadas',
        value: 0,
        icon: <Zap className="w-8 h-8" />,
        color: 'orange' as const,
        trend: 'neutral' as const,
      },
    ],
    []
  );

  const steps = [
    {
      number: 1,
      title: 'Criar Questões',
      description: 'Adicione questões com múltiplas alternativas e marque as respostas corretas',
      icon: <BookOpen className="w-6 h-6" />,
      status: 'ready' as const,
      action: () => navigate('/questoes'),
    },
    {
      number: 2,
      title: 'Montar Prova',
      description: 'Selecione 5 ou mais questões para compor sua prova',
      icon: <FileText className="w-6 h-6" />,
      status: 'ready' as const,
      action: () => navigate('/provas'),
    },
    {
      number: 3,
      title: 'Embaralhar',
      description: 'Configure o embaralhamento de questões e alternativas',
      icon: <Zap className="w-6 h-6" />,
      status: 'pending' as const,
      action: () => {},
    },
    {
      number: 4,
      title: 'Gerar PDF',
      description: 'Exporte a prova em PDF pronta para impressão',
      icon: <BarChart3 className="w-6 h-6" />,
      status: 'pending' as const,
      action: () => {},
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Bem-vindo ao Gerenciador de Provas - Crie, organize e exporte suas
          avaliações
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <StatCard
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              trendValue={stat.trendValue}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          Primeiros Passos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-white flex-shrink-0 ${
                      step.status === 'ready'
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.status === 'ready' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {step.number}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {step.description}
                    </p>
                    <Button
                      variant={step.status === 'ready' ? 'primary' : 'ghost'}
                      disabled={step.status === 'pending'}
                      onClick={step.action}
                      size="sm"
                    >
                      {step.status === 'ready' ? (
                        <>
                          Começar <ArrowUpRight className="w-3 h-3" />
                        </>
                      ) : (
                        'Em breve'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/questoes')}
          >
            ➕ Nova Questão
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/provas')}
          >
            📋 Nova Prova
          </Button>
          <Button variant="outline">
            📊 Ver Relatórios
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
