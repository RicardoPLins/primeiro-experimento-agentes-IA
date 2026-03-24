import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Questao } from '@gerenciador-provas/shared';

const API_URL = '/api';

// Buscar todas as questões
export function useQuestoes() {
  return useQuery({
    queryKey: ['questoes'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/questoes`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Questao[]>;
    },
  });
}

// Buscar uma questão por ID
export function useQuestao(id?: string) {
  return useQuery({
    queryKey: ['questao', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/questoes/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Questao>;
    },
    enabled: !!id,
  });
}

// Criar questão
export function useCriarQuestao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Questao, 'id' | 'createdAt'>) => {
      const res = await fetch(`${API_URL}/questoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Questao>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questoes'] });
    },
  });
}

// Atualizar questão
export function useAtualizarQuestao(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Questao>) => {
      const res = await fetch(`${API_URL}/questoes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Questao>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questoes'] });
      queryClient.invalidateQueries({ queryKey: ['questao', id] });
    },
  });
}

// Deletar questão
export function useDeletarQuestao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/questoes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questoes'] });
    },
  });
}
