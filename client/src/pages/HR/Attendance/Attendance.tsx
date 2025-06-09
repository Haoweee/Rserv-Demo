import { useState } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import ReservationList from '../../../components/ReservationDetails/ReservationList';
import { sampleReservations as baseReservations } from '../../../mocks/sampleReservations';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  });

  const [searchPhone, setSearchPhone] = useState('');

  const currentMonthStart = new Date();
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);

  const sampleReservations = baseReservations.map(({ offsetDays, reservation }) => ({
    ...reservation,
    timestamp: new Date(
      currentMonthStart.getTime() + offsetDays * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));

  const filteredReservations = sampleReservations.filter(r => {
    const matchesPhone = r.phone_number.includes(searchPhone.trim());
    const matchesDate = r.timestamp.split('T')[0] === selectedDate;

    // If searching by phone, return all reservations with that phone (any date)
    if (searchPhone.trim()) return matchesPhone;

    // Otherwise, show only today's reservations
    return matchesDate;
  });

  return (
    <div className="m-4">
      <h1 className="text-sm text-center mb-2">(mock data)</h1>

      <Calendar
        onDateSelect={setSelectedDate}
        minDate={new Date('2023-01-01')}
        disableToday="true"
        isAdminPage={true}
        sampleReservations={sampleReservations}
      />

      <input
        type="text"
        placeholder="Search by phone number"
        value={searchPhone}
        onChange={e => setSearchPhone(e.target.value)}
        className="mb-0 p-2 border border-gray-300 rounded text-sm w-full mt-4"
      />

      <ReservationList sampleReservations={filteredReservations} />
    </div>
  );
}
