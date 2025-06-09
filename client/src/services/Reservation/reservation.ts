const API_URL = process.env.REACT_APP_API_URL;

export interface ReservationData {
  datetime: string;
  numGuests: string;
  occasion?: string | '';
  notes?: '';
}

export const getTodayStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/getTodayStatus`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
      // throw new Error(
      //   data.errorMessage ||
      //     `Failed to get today's status: ${response.statusText}`
      // );
      throw new Error(`Failed to get today's status`);
    }

    return data;
  } catch (error) {
    throw new Error(`Session Expired. Please log in again.`);
  }
};

export const getAvailableTimes = async (seats: string, date: string) => {
  try {
    const response = await fetch(`${API_URL}/getAvailability?seats=${seats}&date=${date}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
      // throw new Error(
      //   data.errorMessage ||
      //     `Failed to get available times: ${response.statusText}`
      // );
      throw new Error(`Failed to get available times`);
    }

    return data;
  } catch (error) {
    throw new Error(`Session Expired. Please log in again.`);
  }
};

export const selectReservation = async (reservationData: ReservationData) => {
  const response = await fetch(`${API_URL}/selectReservation`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });

  const data = await response.json();

  if (!response.ok) {
    // throw new Error(`Failed to create reservation: ${response.statusText}`);
    throw new Error(`Failed to create reservation`);
  }

  return data;
};

export const placeReservationHold = async () => {
  const response = await fetch(`${API_URL}/placeReservationHold`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (!response.ok) {
    // throw new Error(data.errorMessage);
    throw new Error('Error placing reservation hold');
  }

  return data;
};

export const processReservation = async () => {
  const response = await fetch(`${API_URL}/processReservation`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  const result = await response.json();

  if (!response.ok) {
    // throw new Error(result.errorMessage);
    throw new Error('Error processing reservation');
  }

  return result;
};
