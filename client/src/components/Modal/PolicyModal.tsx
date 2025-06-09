import { useState } from 'react';
import { ReactNode } from 'react';
import styles from './PolicyModal.module.scss';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // Trigger the closing animation
    setTimeout(onClose, 300); // Delay unmounting to allow the animation to complete
  };

  return (
    <div
      className={styles.modalBackdrop}
      onClick={handleClose} // Close modal on backdrop click
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ''}`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
