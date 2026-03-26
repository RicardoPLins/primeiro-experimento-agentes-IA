import { useState } from 'react';
import { RelatorioNotas } from '@gerenciador-provas/shared';

const API_URL = 'http://localhost:3000/api/correcao/relatorios';

export const useRelatorios = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const salvarRelatorios = async (relatorios: RelatorioNotas[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('[useRelatorios.salvarRelatorios] Salvando', relatorios.length, 'relatórios');
      
      for (const relatorio of relatorios) {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(relatorio),
        });

        if (!response.ok) {
          throw new Error(`Erro ao salvar relatório: ${response.statusText}`);
        }
      }

      setSuccess(`${relatorios.length} relatórios salvos com sucesso!`);
      return true;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao salvar relatórios';
      setError(mensagem);
      console.error('[useRelatorios.salvarRelatorios] Erro:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const listarRelatorios = async (): Promise<RelatorioNotas[] | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar relatórios: ${response.statusText}`);
      }

      const data = await response.json();
      return data.relatorios || data;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao listar relatórios';
      setError(mensagem);
      console.error('[useRelatorios.listarRelatorios] Erro:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const obterRelatorio = async (id: string): Promise<RelatorioNotas | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter relatório: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao obter relatório';
      setError(mensagem);
      console.error('[useRelatorios.obterRelatorio] Erro:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deletarRelatorio = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar relatório: ${response.statusText}`);
      }

      setSuccess('Relatório deletado com sucesso!');
      return true;
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Erro ao deletar relatório';
      setError(mensagem);
      console.error('[useRelatorios.deletarRelatorio] Erro:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    salvarRelatorios,
    listarRelatorios,
    obterRelatorio,
    deletarRelatorio,
    isLoading,
    error,
    success,
  };
};

export default useRelatorios;
