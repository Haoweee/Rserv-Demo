import { useState, useEffect } from 'react';
import { getAvailableTimes } from '../../services/Reservation/reservation';
import { ISOTo12HourSGT } from '../../utils/formatTime';

export const useGetReservationAvailability = (seats: string | null, date: string | null) => {
  const [availableTimes, setAvailableTimes] = useState<{ time: string; disabled: boolean }[]>([]);
  const [showGetModal, setShowGetModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!seats || !date) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getAvailableTimes(seats, date);

        const transformedTimes = Object.keys(response).map(isoTime => {
          const formattedTime = ISOTo12HourSGT(isoTime);

          return {
            time: formattedTime,
            disabled: response[isoTime].length === 0,
          };
        });

        setAvailableTimes(transformedTimes);
      } catch (err: any) {
        setShowGetModal(true);
        setError('Session Expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [seats, date, showGetModal]);

  return { availableTimes, loading, error, showGetModal };
};
