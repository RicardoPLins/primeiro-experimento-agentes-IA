import { FC } from 'react';

export const ProvaIndividualPage: FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4">📋 Criar Instância de Prova</h1>
        <p className="text-gray-600 mb-4">
          Esta funcionalidade permite embaralhar questões e alternativas para criar variantes individuais de uma prova.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            ⏳ Em desenvolvimento - voltaremos aqui após implementar PDF com embaralhamento
          </p>
        </div>
      </div>
    </div>
  );
};
