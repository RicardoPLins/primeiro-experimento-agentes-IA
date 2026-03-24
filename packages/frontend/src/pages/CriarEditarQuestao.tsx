import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FormQuestao } from '../components/FormQuestao';
import { useQuestao } from '../hooks/useQuestoes';

export const CriarEditarQuestao: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: questao } = useQuestao(id);

  return (
    <div className="p-6">
      <FormQuestao
        questao={questao}
        onSuccess={() => navigate('/questoes')}
      />
    </div>
  );
};
