import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header/UserHeader/Header';
import { useReservationLogout } from '../../../hooks/Reservation/useConfirmationLogout';
import styles from './Confirmation.module.scss';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success } = location.state || {};

  useEffect(() => {
    if (!success) {
      navigate('/reservation', { replace: true });
    }
  }, [success, navigate]);

  useReservationLogout();

  if (!success) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.layout_content}>
        <div className={styles.blurWrapper}>
          <Header currentStep={3} />
          <div className={styles.payment__container}>
            <div className={styles.confirmation__styles}>
              <div className={styles.confirmation__note}>
                <p>
                  Thank you for reserving a table at Maison de Lumière! We’re delighted to have the
                  opportunity to serve you. If there’s anything we can do to make your visit
                  special, let us know. Looking forward to seeing you!{' '}
                </p>
                <br />
                <p>You will be logged out shortly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
