import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTodayStatus } from '../../../hooks/Reservation/useGetTodayStatus';
import { useGetReservationAvailability } from '../../../hooks/Reservation/useGetAvailability';
import { useReservation } from '../../../hooks/Reservation/useReservation';
import { useNavigateToHome } from '../../../hooks/Reservation/useNavigateToHome';
import Modal from '../../../components/Modal/Modal';
import SeatInput from '../../../components/SeatInput/SeatInput';
import Input from '../../../components/Input/Input';
import Dropdown from '../../../components/Dropdown/Dropdown';
import Calendar from '../../../components/Calendar/Calendar';
import NavigationButtons from '../../../components/NavigationButtons/NavigationButtons';
import styles from './Reservation.module.scss';

export default function Reservation() {
  const navigate = useNavigate();
  const {
    showModal,
    reservationData,
    selectedTime,
    selectedDate,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    errors,
  } = useReservation();
  const { todayStatus, showTodayModal } = useGetTodayStatus();
  const [selectedAdultSeats, setSelectedAdultSeats] = useState<number>(2);
  const [selectedChildrenSeats, setSelectedChildrenSeats] = useState<number>(0);

  // Add adult seats and children seats to the selectedSeats
  const selectedSeatsNumber = selectedAdultSeats + selectedChildrenSeats;
  const selectedSeats = selectedSeatsNumber.toString();

  // const [selectedSeats, setSelectedSeats] = useState<string>(reservationData.numGuests);
  const {
    availableTimes,
    showGetModal,
  }: {
    availableTimes: { time: string; disabled: boolean }[];
    loading: boolean;
    error: string | null;
    showGetModal: boolean;
  } = useGetReservationAvailability(selectedSeats, selectedDate);

  const { handleNavigateToHome } = useNavigateToHome();

  const isGuestsSelected = !!selectedSeats;
  const isDateSelected = !!selectedDate;

  const sgt = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
  sgt.setHours(0, 0, 0, 0);

  return (
    <motion.div
      className={styles.reservation__container}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.reservation__content}>
        <div
          className={`${styles.dateSection} ${
            !isGuestsSelected ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {/* <p>Date<span className="text-red-600">*</span></p> */}
          <Calendar
            onDateSelect={(utcDateString: string) => {
              if (isGuestsSelected) handleDateChange(utcDateString);
            }}
            minDate={sgt}
            disableToday={todayStatus.toString()}
          />

          <div className="text-red-500 text-sm" style={{ height: '1.5rem' }}>
            {errors.selectedDate}
          </div>
        </div>

        <div className={styles.relativeContainer}>
          <p className={styles.guestTitle}>Number of Guests</p>
          <hr />
          <div>
            <div className={styles.guestsInput}>
              <SeatInput
                label="Adult(s)"
                min={true}
                subtitle="(13 years and above)"
                value={selectedAdultSeats.toString()}
                onChange={newValue => {
                  const num = Math.max(parseInt(newValue, 10) || 0, 0);
                  setSelectedAdultSeats(num);
                  handleChange('numGuests', num + selectedChildrenSeats);
                }}
              />
              <SeatInput
                label="Children(s)"
                min={false}
                subtitle="(12 years and below)"
                value={selectedChildrenSeats.toString()}
                onChange={newValue => {
                  const num = Math.max(parseInt(newValue, 10) || 0, 0);
                  setSelectedChildrenSeats(num);
                  handleChange('numGuests', num + selectedAdultSeats);
                }}
              />

              {/* <div
              className="text-red-500 text-sm"
              style={{ height: "1.5rem" }}
            >
              {errors.numGuests}
            </div> */}
              <hr />
            </div>

            <div className={styles.guestTimeOccasionWrapper}>
              <Dropdown
                label="Time"
                placeholder={'Select Time'}
                options={availableTimes.map(({ time, disabled }) => ({
                  label: time,
                  value: time,
                  disabled,
                }))}
                value={selectedTime || ''}
                onChange={value => {
                  if (isDateSelected) handleTimeChange(value);
                }}
                className={styles.clearInput}
                required
                renderOption={option => (
                  <div
                    className={`${
                      option.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-black cursor-pointer'
                    }`}
                  >
                    <span>{option.label}</span>
                  </div>
                )}
              />

              <Input
                label="Occasion"
                type="text"
                value={reservationData.occasion || ''}
                onChange={e => handleChange('occasion', e.target.value)}
                className={styles.clearInput}
                inputClassName={styles.centeredInput}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className={styles.footer__buttons}>
        <NavigationButtons
          navigateNext={handleSubmit}
          handleNavigateToHome={handleNavigateToHome}
        />
      </div>

      <>
        {showTodayModal && (
          <Modal
            first={true}
            title="Session Expired"
            message="Your session has expired. Please log in again."
            onConfirm={() => navigate('/')}
          />
        )}
      </>
      <>
        {showGetModal && (
          <Modal
            first={true}
            title="Session Expired"
            message="Your session has expired. Please log in again."
            onConfirm={() => navigate('/')}
          />
        )}
      </>
      <>
        {showModal && (
          <Modal
            first={true}
            title="Session Expired"
            message="Your session has expired. Please log in again."
            onConfirm={() => navigate('/')}
          />
        )}
      </>
    </motion.div>
  );
}
