import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendar.module.scss';

interface CalendarProps {
  onDateSelect: (date: string) => void;
  minDate?: Date;
  disableToday?: string;
  isAdminPage?: boolean;
  sampleReservations?: any[];
}

export default function Calendar({
  onDateSelect,
  minDate,
  disableToday,
  isAdminPage = false,
  sampleReservations = [],
}: CalendarProps) {
  const toSingaporeTimeMidnight = (date: Date) => {
    const singaporeDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
    singaporeDate.setHours(0, 0, 0, 0);
    return singaporeDate;
  };

  const initialDate = toSingaporeTimeMidnight(new Date());
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const isDisabled = (date: Date) => {
    const today = toSingaporeTimeMidnight(new Date());
    const singaporeMinDate = minDate ? toSingaporeTimeMidnight(minDate) : null;
    const normalizedDate = toSingaporeTimeMidnight(date);

    if (normalizedDate.getTime() === today.getTime()) {
      return disableToday === 'false';
    }

    if (singaporeMinDate && normalizedDate.getTime() < singaporeMinDate.getTime()) {
      return true;
    }

    return false;
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const singaporeDate = toSingaporeTimeMidnight(date);

    if (isDisabled(singaporeDate)) return;

    const dateString = singaporeDate.toISOString().split('T')[0];
    setSelectedDate(dateString);
    onDateSelect(dateString);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentDate(toSingaporeTimeMidnight(newDate));
  };

  const reservationsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    sampleReservations.forEach(r => {
      const date = new Date(r.timestamp).toISOString().split('T')[0];
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  }, [sampleReservations]);

  return (
    <div
      className={`${styles.calendar} ${isAdminPage ? styles.adminCalendar : styles.publicCalendar}`}
    >
      <div className={styles.header}>
        <button
          className={`${styles.headerButton} ${
            isAdminPage ? styles.headerButtonAdmin : styles.headerButtonPublic
          }`}
          onClick={() => changeMonth(-1)}
        >
          <ChevronLeft />
        </button>
        <span>
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Singapore',
          })}
        </span>
        <button
          className={`${styles.headerButton} ${
            isAdminPage ? styles.headerButtonAdmin : styles.headerButtonPublic
          }`}
          onClick={() => changeMonth(1)}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Days of the week */}
      <div className={styles.daysOfWeek}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.dayOfWeek}>
            {day}
          </div>
        ))}
      </div>

      {/* Days of the month */}
      <div className={styles.days}>
        {/* Empty spaces for days before the first of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={index} className={styles.empty}></div>
        ))}

        {/* Render each day of the month */}
        {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
          const day = dayIndex + 1;
          const date = new Date(currentYear, currentMonth, day);
          const singaporeDate = toSingaporeTimeMidnight(date);
          const dateString = singaporeDate.toISOString().split('T')[0];
          const isSelected = selectedDate === dateString;
          const disabled = isDisabled(singaporeDate);
          const reservationCount = reservationsByDate[dateString] || 0;

          return (
            <div
              key={day}
              className={`
                ${styles.day}
                ${isAdminPage ? styles.dayAdmin : styles.dayPublic}
                ${isSelected ? (isAdminPage ? styles.selectedAdmin : styles.selectedPublic) : ''}
                ${disabled ? styles.disabled : ''}
              `}
              onClick={() => !disabled && handleDateClick(day)}
              role="button"
              aria-disabled={disabled}
            >
              <div>{day}</div>

              {isAdminPage && reservationCount > 0 && (
                <div className={styles.reservationBadge}>{reservationCount}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
