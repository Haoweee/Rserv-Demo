import { motion } from 'framer-motion';
import styles from './Header.module.scss';

interface HeaderProps {
  currentStep: number;
}

export default function Header({ currentStep }: HeaderProps) {
  const renderStep = (label: string, step: number, isFirst = false, isLast = false) => {
    const isCurrent = currentStep === step;
    const isCompleted = currentStep > step;
    const isConfirmationCurrent = step === 3 && isCurrent;

    const bgColor = isConfirmationCurrent
      ? '#28a745'
      : isCurrent
        ? '#ffffff'
        : isCompleted
          ? '#28a745'
          : 'transparent';

    const borderColor = isConfirmationCurrent
      ? '#28a745'
      : isCurrent
        ? '#ffffff'
        : isCompleted
          ? '#28a745'
          : '#111';

    return (
      <div className={styles.headerSection}>
        <div className={styles.progress__indicator}>
          <motion.div
            layout
            initial={false}
            animate={{
              backgroundColor: bgColor,
              borderColor: borderColor,
              scale: isCurrent || isCompleted ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
            className={styles.circle}
          />

          <span className={currentStep >= step ? styles.textActive : ''}>{label}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.topNav}>
        <div className={styles.topNav_content}>
          <div>
            <span className={styles.title}>Maison de Lumeire</span>
          </div>
        </div>
      </div>
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          {renderStep('Reserve', 1, true)}
          <motion.div
            className={styles.stepLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStep > 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          {renderStep('Deposit', 2)}
          <motion.div
            className={styles.stepLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: currentStep > 2 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          {renderStep('Confirmation', 3, false, true)}
        </div>
      </div>
    </>
  );
}
