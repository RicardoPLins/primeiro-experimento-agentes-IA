import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  LibraryBooks as BookOpenIcon,
  Description as FileTextIcon,
  Print as PrinterIcon,
  CheckBox as CheckSquareIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Help as HelpCircleIcon,
} from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';

export const Sidebar: FC = () => {
  const location = useLocation();

  const menuItems = [
    { icon: HomeIcon, label: 'Dashboard', path: '/' },
    { icon: BookOpenIcon, label: 'Questões', path: '/questoes' },
    { icon: FileTextIcon, label: 'Provas', path: '/provas' },
    { icon: PrinterIcon, label: 'Gerar PDF', path: '/pdf/1' },
    { icon: CheckSquareIcon, label: 'Correção', path: '/correcao' },
    { icon: BarChartIcon, label: 'Relatório', path: '/relatorios' },
  ];

  const secondaryItems = [
    { icon: HelpCircleIcon, label: 'Ajuda', path: '/help' },
    { icon: SettingsIcon, label: 'Configurações', path: '/settings' },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
      }}
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Box sx={{ px: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              width: 40,
              height: 40,
              fontWeight: 'bold',
            }}
          >
            GP
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Gerenciador Provas
          </Typography>
        </Box>
      </motion.div>

      {/* Main Menu */}
      <List sx={{ flex: 1 }}>
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ListItem
                component={Link}
                to={item.path}
                sx={{
                  px: 2,
                  py: 1.5,
                  mb: 0.5,
                  color: isActive ? '#667eea' : '#aaa',
                  backgroundColor: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid #667eea' : '3px solid transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    color: '#667eea',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? '#667eea' : '#aaa',
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { fontWeight: isActive ? '600' : '500' },
                  }}
                />
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255, 0.1)', my: 2 }} />

      {/* Secondary Menu */}
      <List>
        {secondaryItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            >
              <ListItem
                component={Link}
                to={item.path}
                sx={{
                  px: 2,
                  py: 1.5,
                  color: '#aaa',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    color: '#667eea',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: '#aaa' }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Box sx={{ px: 2, py: 2, borderTop: '1px solid rgba(255,255,255, 0.1)' }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            v1.0.0
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
            💡 Dica: Use o formulário com validação em tempo real
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: 'transparent',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
