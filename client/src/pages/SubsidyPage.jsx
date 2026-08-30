import { Navigate, useParams } from 'react-router-dom';
import PmSuryaGharPage from '@/pages/PmSuryaGharPage';

export default function SubsidyPage() {
  const { topic } = useParams();

  if (topic === 'pm-surya-ghar') {
    return <PmSuryaGharPage />;
  }

  return <Navigate to="/subsidy/pm-surya-ghar" replace />;
}
