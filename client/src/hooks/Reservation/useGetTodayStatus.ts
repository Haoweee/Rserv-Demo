import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayStatus } from '../../services/Reservation/reservation';

export const useGetTodayStatus = () => {
  const [showTodayModal, setShowTodayModal] = useState<boolean>(false);
  const [todayStatus, setTodayStatus] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayStatus = async () => {
      try {
        const response = await getTodayStatus();

        setTodayStatus(response.today);
      } catch (err: any) {
        setShowTodayModal(true);
        navigate('/', { replace: true });
        setTodayStatus('Unauthorized');
      }
    };

    fetchTodayStatus();
  }, [navigate]);

  return { todayStatus, showTodayModal };
};
