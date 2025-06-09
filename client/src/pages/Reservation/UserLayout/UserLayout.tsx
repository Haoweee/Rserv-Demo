import { useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../../components/Header/UserHeader/Header';
import styles from './UserLayout.module.scss';

export default function UserLayout() {
  const location = useLocation();

  const currentStep = (() => {
    switch (location.pathname) {
      case '/reservation':
        return 1;
      case '/deposit':
        return 2;
      case '/confirmation':
        return 3;
      default:
        return 0;
    }
  })();

  const isReservationPage = location.pathname.startsWith('/reservation');

  return (
    <div className={styles.layout}>
      <div className={styles.layout_content}>
        <div className={styles.blurWrapper}>
          {isReservationPage ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Header currentStep={currentStep} />
              <Outlet />
            </motion.div>
          ) : (
            <>
              <Header currentStep={currentStep} />
              <Outlet />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
