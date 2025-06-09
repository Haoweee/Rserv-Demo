import { useState } from 'react';
import { placeReservationHold } from '../../services/Reservation/reservation';

export const usePlaceReservationHold = () => {
  const [error, setError] = useState<string | null>(null);

  const holdReservation = async () => {
    try {
      const response = await placeReservationHold();

      if (response.error) {
        console.error(response.errorMessage);
        setError(response.errorMessage);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while finalizing the reservation.');
    }
  };

  return { holdReservation, error };
};
