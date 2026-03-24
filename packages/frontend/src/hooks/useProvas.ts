import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Prova } from '@gerenciador-provas/shared';

const API_URL = '/api';

// Buscar todas as provas
export function useProvas() {
  return useQuery({
    queryKey: ['provas'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/provas`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Prova[]>;
    },
  });
}

// Buscar uma prova por ID
export function useProva(id?: string) {
  return useQuery({
    queryKey: ['prova', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/provas/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Prova>;
    },
    enabled: !!id,
  });
}

// Criar prova
export function useCriarProva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Prova, 'id' | 'createdAt'>) => {
      const res = await fetch(`${API_URL}/provas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Prova>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provas'] });
    },
  });
}

// Atualizar prova
export function useAtualizarProva(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Prova>) => {
      const res = await fetch(`${API_URL}/provas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Prova>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provas'] });
      queryClient.invalidateQueries({ queryKey: ['prova', id] });
    },
  });
}

// Deletar prova
export function useDeletarProva() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/provas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provas'] });
    },
  });
}
