import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processReservation } from '../../services/Reservation/reservation';

export const useFinalizeReservation = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const finalizeReservation = async () => {
    try {
      const response = await processReservation();

      if (response.error) {
        console.error(response.errorMessage);
        setError(response.errorMessage);
        return;
      }

      navigate('/confirmation', {
        state: { success: response.success },
      });
    } catch (error) {
      console.error(error);
      setError('An error occurred while finalizing the reservation.');
    }
  };

  return { finalizeReservation, error };
};
