import { Navigate, useParams } from 'react-router-dom';
import SolarBuyingGuidePage from '@/pages/SolarBuyingGuidePage';

export default function LearnPage() {
  const { topic } = useParams();

  if (topic === 'solar-buying-guide') {
    return <SolarBuyingGuidePage />;
  }

  return <Navigate to="/learn/solar-buying-guide" replace />;
}
