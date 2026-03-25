import { FC } from 'react';
import { Questao } from '@gerenciador-provas/shared';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  Checkbox,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface QuestaoCardProps {
  questao: Questao;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  index?: number;
}

export const QuestaoCard: FC<QuestaoCardProps> = ({
  questao,
  onEdit,
  onDelete,
  isSelectable,
  isSelected,
  onSelect,
  index,
}) => {
  const corretasCount = questao.alternativas.filter((a) => a.isCorreta).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          background: isSelected ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' : '#fff',
          borderLeft: isSelected ? '4px solid #1976d2' : 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isSelectable && (
              <Checkbox
                checked={isSelected || false}
                onChange={() => onSelect?.(questao.id)}
                sx={{ flex: 'none' }}
              />
            )}

            {index !== undefined && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  flex: 'none',
                  boxShadow: 2,
                }}
              >
                {index + 1}
              </Box>
            )}

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {questao.enunciado}
              </Typography>

              <Box sx={{ mb: 2 }}>
                {questao.alternativas.map((alt, idx) => (
                  <Box
                    key={alt.id}
                    sx={{
                      p: 1,
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: alt.isCorreta ? '#e8f5e9' : '#f5f5f5',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      fontSize: '0.875rem',
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {String.fromCharCode(65 + idx)}){' '}
                    </Typography>
                    <Typography sx={{ flex: 1 }}>{alt.descricao}</Typography>
                    {alt.isCorreta && <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={`❓ ${questao.alternativas.length} alternativas`} size="small" />
                <Chip label={`✓ ${corretasCount} correta${corretasCount !== 1 ? 's' : ''}`} size="small" color="success" />
              </Box>
            </Box>
          </Box>
        </CardContent>

        {(onEdit || onDelete) && (
          <CardActions sx={{ gap: 1 }}>
            {onEdit && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => onEdit(questao.id)}
                sx={{ textTransform: 'none' }}
              >
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(questao.id)}
                sx={{ textTransform: 'none' }}
              >
                Deletar
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </motion.div>
  );
};
