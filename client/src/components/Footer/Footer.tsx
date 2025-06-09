import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles['left-section']}>Footer Left</div>

      <div className={styles['middle-section']}>Footer Center</div>

      <div className={styles['right-section']}>Footer Right</div>
    </div>
  );
}
