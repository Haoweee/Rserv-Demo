import Button from '../Button/Button';
import styles from './NavigationButtons.module.scss';

type NavigationButtonsProps = {
  navigateNext: () => void;
  handleNavigateToHome: () => void;
  placeholder?: string;
};

export default function NavigationButtons({
  navigateNext,
  handleNavigateToHome,
  placeholder,
}: NavigationButtonsProps) {
  return (
    <div className={styles.navigation__container}>
      <Button onClick={handleNavigateToHome} className={styles.backButton}>
        <span>Logout</span>
      </Button>
      <Button onClick={navigateNext} className={styles.submitButton}>
        <span>{placeholder || 'Next'}</span>
      </Button>
    </div>
  );
}
