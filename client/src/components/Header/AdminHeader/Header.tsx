import { NavLink } from 'react-router-dom';
import { useLogout } from '../../../hooks/HR/useLogout';
import Button from '../../Button/Button';
import styles from './Header.module.scss';

export default function Header() {
  const { logout } = useLogout();

  return (
    <div className={styles.header}>
      <div className={styles['left-section']}>
        <NavLink to={'/admin/bulletinBoard'}>
          <h1>RestaurantEco</h1>
        </NavLink>
      </div>

      <div className={styles['middle-section']}>
        <div className={styles.links}>
          <NavLink
            to={'/admin/bulletinBoard'}
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Bulletin Board
          </NavLink>
          <NavLink
            to={'/admin/attendence'}
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Attendence
          </NavLink>
          <NavLink
            to={'/admin/pay-slip'}
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Pay Slip
          </NavLink>
          <NavLink
            to={'/admin/claims'}
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Claims
          </NavLink>
        </div>
      </div>

      <div className={styles['right-section']}>
        <Button onClick={logout} className={styles['logout-button']}>
          Logout
        </Button>
      </div>
    </div>
  );
}
