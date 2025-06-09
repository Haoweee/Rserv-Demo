import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectReservation, ReservationData } from '../../services/Reservation/reservation';
import { verifyReservationToken } from '../../services/Reservation/auth';
import { SGTToUTC, combineDateTimeToISO } from '../../utils/formatTime';

export const useReservation = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState<Omit<ReservationData, 'datetime'>>({
    numGuests: '',
    occasion: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{
    numGuests?: string;
    selectedDate?: string;
    selectedTime?: string;
    occasion?: string;
  }>({});

  const navigate = useNavigate();

  const validateFields = (): boolean => {
    const newErrors: typeof errors = {
      numGuests: reservationData.numGuests >= '2' ? '' : 'At least 2 guests are required.',
      selectedDate: selectedDate ? '' : 'Please select a date.',
      selectedTime: selectedTime ? '' : 'Please select a time.',
    };

    setErrors(newErrors);

    return Object.values(newErrors).every(error => error === '');
  };

  const handleChange = (field: keyof Omit<ReservationData, 'datetime'>, value: string | number) => {
    setReservationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    try {
      if (!validateFields()) return;

      if (!selectedDate || !selectedTime) {
        console.error('Selected date or time is missing.');
        return;
      }

      // Validate the token before proceeding
      const tokenResponse = await verifyReservationToken();
      if (tokenResponse?.error) {
        console.error('Session expired. Please login again.');
        setShowModal(true);
        return;
      }

      const combiningDatetime = combineDateTimeToISO(selectedDate, selectedTime);
      const datetime = SGTToUTC(combiningDatetime);

      if (!datetime) {
        console.error('Invalid datetime:', datetime);
        return;
      }

      const fullReservationData: ReservationData = {
        ...reservationData,
        datetime,
      };

      const response = await selectReservation(fullReservationData);

      if (response?.client_secret) {
        navigate('/deposit', {
          state: {
            clientSecret: response.client_secret,
            reservationData: fullReservationData,
          },
        });
      } else {
        console.error('Client Secret is missing in response:', response);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return {
    showModal,
    reservationData,
    selectedDate,
    selectedTime,
    errors,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
  };
};
