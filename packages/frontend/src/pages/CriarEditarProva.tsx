import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormProva } from '../components/FormProva';
import { useProva } from '../hooks/useProvas';

export const CriarEditarProva: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: prova } = useProva(id);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/provas')}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Voltar
      </button>
      <FormProva
        prova={prova}
        onSuccess={() => navigate('/provas')}
      />
    </div>
  );
};
