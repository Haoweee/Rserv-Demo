const API_URL = process.env.REACT_APP_API_URL;

export const getReservationSettings = async () => {
  const response = await fetch(`${API_URL}/getReservationSetttings`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await response.json();
  return data;
};

export const setReservationSettings = async (
  startTime: string,
  endTime: string,
  buffer: number,
  tables: {
    tableID: number;
    tableCount: number;
    maxSeats: number;
    minSeats: number;
  }[]
) => {
  const response = await fetch(`${API_URL}/setReservationSetttings`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startTime, endTime, buffer, tables }),
  });
  const data = await response.json();
  return data;
};
