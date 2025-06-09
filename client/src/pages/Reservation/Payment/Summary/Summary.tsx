import { extractDateAndTime } from '../../../../utils/formatTime';
import { SummaryReservationData } from '../../../../types/ReservationData';
import styles from './Summary.module.scss';

export default function Summary({ reservationData }: { reservationData: SummaryReservationData }) {
  const { date, time } = extractDateAndTime(reservationData.datetime);

  return (
    <div className={styles.summary__container}>
      <h1>Summary</h1>
      <hr />
      <div className={styles.space__between}>
        <p>
          <strong>Date:</strong>
        </p>{' '}
        <p>{date}</p>
      </div>
      <div className={styles.space__between}>
        <p>
          <strong>Time:</strong>
        </p>{' '}
        <p>{time}</p>
      </div>
      <div className={styles.space__between}>
        <p>
          <strong>Guests:</strong>
        </p>{' '}
        <p>{reservationData.numGuests}</p>
      </div>
      <div className={styles.space__between}>
        <p>
          <strong>Occasion:</strong>
        </p>{' '}
        <p>{reservationData.occasion || 'N/A'}</p>
      </div>
      <hr />
      <div className={styles.space__between}>
        <p>
          <strong>Total:</strong>
        </p>{' '}
        <p>
          <strong>$100</strong>
        </p>
      </div>
    </div>
  );
}
