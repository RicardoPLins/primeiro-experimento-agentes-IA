import { FC } from 'react';

export const Dashboard: FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm">Questões</div>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm">Provas</div>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm">PDFs Gerados</div>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-lg shadow-md">
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm">Correções</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">🚀 Primeiros Passos</h2>
        <ol className="space-y-3 text-lg">
          <li>✅ <strong>Backend conectado</strong> - API rodando em http://localhost:3000</li>
          <li>⏳ <strong>Criar questões</strong> - Vá para a seção "Questões"</li>
          <li>⏳ <strong>Criar prova</strong> - Selecione 5 questões e configure a prova</li>
          <li>⏳ <strong>Gerar PDF</strong> - Embaralhe e exporte em PDF</li>
          <li>⏳ <strong>Corrigir</strong> - Importe respostas CSV e gere notas</li>
        </ol>
      </div>
    </div>
  );
};
