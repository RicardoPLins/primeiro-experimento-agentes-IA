import { FC } from 'react';
import {
  LibraryBooks as BookOpenIcon,
  Description as FileTextIcon,
  BarChart as BarChartIcon,
  ElectricBolt as ZapIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useProvas } from '../hooks/useProvas';
import { useQuestoes } from '../hooks/useQuestoes';

export const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { data: provas = [] } = useProvas();
  const { data: questoes = [] } = useQuestoes();

  const stats = [
    {
      label: 'Total de Questões',
      value: questoes.length,
      icon: BookOpenIcon,
      color: '#667eea',
    },
    {
      label: 'Provas Criadas',
      value: provas.length,
      icon: FileTextIcon,
      color: '#2e7d32',
    },
    {
      label: 'PDFs Gerados',
      value: 0,
      icon: BarChartIcon,
      color: '#9c27b0',
    },
    {
      label: 'Correções Processadas',
      value: 0,
      icon: ZapIcon,
      color: '#f57c00',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Criar Questões',
      description: 'Adicione questões com múltiplas alternativas e marque as respostas corretas',
      icon: BookOpenIcon,
      status: 'ready',
      action: () => navigate('/questoes'),
    },
    {
      number: 2,
      title: 'Montar Prova',
      description: 'Selecione 5 ou mais questões para compor sua prova',
      icon: FileTextIcon,
      status: 'ready',
      action: () => navigate('/provas'),
    },
    {
      number: 3,
      title: 'Embaralhar',
      description: 'Configure o embaralhamento de questões e alternativas',
      icon: ZapIcon,
      status: 'pending',
      action: () => {},
    },
    {
      number: 4,
      title: 'Gerar PDF',
      description: 'Exporte a prova em PDF pronta para impressão',
      icon: BarChartIcon,
      status: 'pending',
      action: () => {},
    },
  ];

  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                mb: 1,
              }}
            >
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Bem-vindo ao Gerenciador de Provas - Acompanhe suas questões e provas
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 6 }}>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #fff 0%, #f5f5f5 100%)',
                    boxShadow: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography color="textSecondary" gutterBottom>
                          {stat.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: stat.color,
                          color: '#fff',
                          p: 1.5,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon sx={{ fontSize: 24 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </Box>

        {/* Steps Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#fff',
                mb: 3,
              }}
            >
              ✨ Primeiros Passos
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isReady = step.status === 'ready';

                return (
                  <Box key={idx}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          background: isReady
                            ? 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
                            : 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                          color: '#fff',
                          cursor: isReady ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                          '&:hover': isReady ? { transform: 'translateY(-5px)', boxShadow: 6 } : {},
                          opacity: isReady ? 1 : 0.6,
                        }}
                        onClick={step.action}
                      >
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                            }}
                          >
                            <Icon sx={{ fontSize: 32, color: '#fff' }} />
                          </Box>

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              mb: 1,
                              color: '#fff',
                            }}
                          >
                            {step.number}. {step.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              mb: 2,
                              minHeight: 40,
                            }}
                          >
                            {step.description}
                          </Typography>

                          <Box
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 1,
                              p: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#fff',
                                fontWeight: 'bold',
                              }}
                            >
                              {isReady ? '✅ Pronto' : '⏳ Em breve'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
              p: 4,
              boxShadow: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
              🚀 Ações Rápidas
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/questoes/nova')}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  ➕ Criar Nova Questão
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/provas/nova')}
                  sx={{
                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    py: 2,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  📝 Criar Nova Prova
                </Button>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/questoes')}
                sx={{
                  py: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  color: '#667eea',
                  borderColor: '#667eea',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderColor: '#667eea',
                  },
                }}
              >
                📋 Ver Todas as Questões
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};
