import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToHome } from '../../services/Reservation/auth';

export const useNavigateToHome = () => {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleNavigateToHome = async () => {
    const response = await navigateToHome();
    if (response.error) {
      setError(response.error);
    } else {
      setError('');
      navigate('/', { replace: true });
    }
  };

  return { handleNavigateToHome, error };
};
