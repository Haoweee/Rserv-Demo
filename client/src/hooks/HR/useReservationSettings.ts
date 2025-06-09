import { useEffect, useState, useCallback } from 'react';
import { getReservationSettings, setReservationSettings } from '../../services/HR/reservation';
import { SGTToUTC, combineDateTimeToISO } from '../../utils/formatTime';
import type { ReservationSettings } from '../../types/ReservationData';

export const useGetReservationSettings = () => {
  const [settings, setSettings] = useState<ReservationSettings | null>(null);
  const [getError, setError] = useState('');
  const [getLoading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getReservationSettings();
      setSettings(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, getError, getLoading, fetchSettings };
};

export const useSetReservationSettings = () => {
  const [sendError, setError] = useState('');
  const [sendLoading, setLoading] = useState(false);

  const sendReservationSettings = async (
    startTime: string,
    endTime: string,
    buffer: number,
    tables: {
      tableID: number;
      tableCount: number;
      maxSeats: number;
      minSeats: number;
    }[],
    onSettingsUpdated?: () => void
  ) => {
    setLoading(true);
    setError('');

    const formatStartTime = combineDateTimeToISO('2024-11-11', startTime);
    const convertStartUTC = SGTToUTC(formatStartTime);

    const formatEndTime = combineDateTimeToISO('2024-12-11', endTime);
    const convertEndUTC = SGTToUTC(formatEndTime);

    try {
      const data = await setReservationSettings(convertStartUTC, convertEndUTC, buffer, tables);

      if (onSettingsUpdated) {
        onSettingsUpdated();
      }

      return data;
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendReservationSettings, sendError, sendLoading };
};
