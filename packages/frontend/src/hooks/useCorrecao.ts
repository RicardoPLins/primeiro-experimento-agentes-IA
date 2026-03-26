import { useState } from 'react';
import { ModoCorrecao } from '@gerenciador-provas/shared';

// API URL configuration - adjust based on environment
const API_URL = 'http://localhost:3000/api';

interface CorrecaoResult {
  sucesso: boolean;
  totalRelatorios: number;
  relatorios: any[];
  estatisticas: any;
  mensagem: string;
}

interface RelatoriosResult {
  sucesso: boolean;
  total: number;
  relatorios: any[];
}

interface EstatisticasResult {
  sucesso: boolean;
  estatisticas: any;
  totalRelatorios: number;
}

/**
 * Hook para operações de correção de provas
 */
export const useCorrecao = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  /**
   * Corrigir provas enviando arquivos CSV
   */
  const corrigir = async (
    provaId: string,
    csvGabarito: File,
    csvRespostas: File,
    modoCorrecao: ModoCorrecao
  ): Promise<CorrecaoResult | null> => {
    try {
      setIsLoading(true);
      clearMessages();

      const formData = new FormData();
      formData.append('csvGabarito', csvGabarito);
      formData.append('csvRespostas', csvRespostas);
      formData.append('provaId', provaId);
      formData.append('modoCorrecao', modoCorrecao);

      const response = await fetch(`${API_URL}/correcao`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao corrigir provas');
      }

      const data: CorrecaoResult = await response.json();
      setSuccess(`✅ ${data.mensagem}`);
      setIsLoading(false);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao corrigir provas';
      setError(`❌ ${message}`);
      setIsLoading(false);
      return null;
    }
  };

  /**
   * Listar todos os relatórios
   */
  const listarRelatorios = async (): Promise<RelatoriosResult | null> => {
    try {
      setIsLoading(true);
      clearMessages();

      const response = await fetch(`${API_URL}/correcao/relatorios`);

      if (!response.ok) {
        throw new Error('Erro ao listar relatórios');
      }

      const data: RelatoriosResult = await response.json();
      setIsLoading(false);

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao listar relatórios';
      setError(`❌ ${message}`);
      setIsLoading(false);
      return null;
    }
  };

  /**
   * Obter um relatório específico por ID
   */
  const obterRelatorio = async (id: string): Promise<any | null> => {
    try {
      setIsLoading(true);
      clearMessages();

      const response = await fetch(`${API_URL}/correcao/relatorios/${id}`);

      if (!response.ok) {
        throw new Error('Relatório não encontrado');
      }

      const data = await response.json();
      setIsLoading(false);

      return data.relatorio;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao obter relatório';
      setError(`❌ ${message}`);
      setIsLoading(false);
      return null;
    }
  };

  /**
   * Obter relatório de um aluno por email
   */
  const obterRelatorioPorEmail = async (email: string): Promise<any | null> => {
    try {
      setIsLoading(true);
      clearMessages();

      const response = await fetch(`${API_URL}/correcao/relatorios/email/${email}`);

      if (!response.ok) {
        throw new Error('Relatório não encontrado');
      }

      const data = await response.json();
      setIsLoading(false);

      return data.relatorio;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao obter relatório';
      setError(`❌ ${message}`);
      setIsLoading(false);
      return null;
    }
  };

  /**
   * Obter estatísticas gerais
   */
  const obterEstatisticas = async (): Promise<EstatisticasResult | null> => {
    try {
      const response = await fetch(`${API_URL}/correcao/estatisticas`);

      if (!response.ok) {
        throw new Error('Erro ao obter estatísticas');
      }

      const data: EstatisticasResult = await response.json();

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao obter estatísticas';
      setError(`❌ ${message}`);
      return null;
    }
  };

  /**
   * Deletar um relatório
   */
  const deletarRelatorio = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      clearMessages();

      const response = await fetch(`${API_URL}/correcao/relatorios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar relatório');
      }

      setSuccess('✅ Relatório deletado com sucesso');
      setIsLoading(false);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar relatório';
      setError(`❌ ${message}`);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Exportar relatórios em CSV
   */
  const exportarCSV = async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearMessages();

      const response = await fetch(`${API_URL}/correcao/relatorios/csv`);

      if (!response.ok) {
        throw new Error('Erro ao exportar CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorios-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('✅ CSV exportado com sucesso');
      setIsLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao exportar CSV';
      setError(`❌ ${message}`);
      setIsLoading(false);
    }
  };

  return {
    corrigir,
    listarRelatorios,
    obterRelatorio,
    obterRelatorioPorEmail,
    obterEstatisticas,
    deletarRelatorio,
    exportarCSV,
    isLoading,
    error,
    success,
  };
};
