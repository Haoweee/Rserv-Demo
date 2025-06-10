import React, { useState } from 'react';

const headers = [
  { key: 'phone_number', label: 'Phone' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'guests', label: 'Guests' },
  { key: 'occasion', label: 'Occasion' },
  { key: 'notes', label: 'Notes' },
  { key: 'table_id', label: 'Table ID' },
];

export default function ReservationList({ sampleReservations }: { sampleReservations: any[] }) {
  const [search] = useState('');

  const filteredReservations = sampleReservations.filter(res => {
    const dateObj = new Date(res.timestamp);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const searchText =
      `${res.phone_number} ${date} ${time} ${res.guests} ${res.occasion} ${res.notes} ${res.table_id}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col pt-4 px-2">
      {filteredReservations.length === 0 ? (
        <p className="text-gray-500">No matching reservations found.</p>
      ) : (
        <>
          {/* Desktop/tablet header */}
          <div className="hidden sm:grid grid-cols-7 gap-4 text-sm font-semibold text-gray-700 border-b pb-2">
            {headers.map(h => (
              <div key={h.key} className="uppercase">
                {h.label}
              </div>
            ))}
          </div>

          <div className="space-y-4 mt-2">
            {filteredReservations.map(res => {
              const dateObj = new Date(res.timestamp);
              const date = dateObj.toLocaleDateString();
              const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={res.reservation_id} className="border-b pb-2">
                  {/* Mobile layout */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:hidden">
                    {headers.map(h => (
                      <React.Fragment key={h.key}>
                        <div className="font-semibold text-gray-600">{h.label}</div>
                        <div className="text-gray-800 break-words">
                          {h.key === 'date' ? date : h.key === 'time' ? time : (res as any)[h.key]}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-7 gap-4 text-sm">
                    {headers.map(h => (
                      <div key={h.key}>
                        {h.key === 'date' ? date : h.key === 'time' ? time : (res as any)[h.key]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
