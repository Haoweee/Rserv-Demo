import React, { useEffect } from 'react';
import Button from '../Button/Button';
import styles from './Modal.module.scss';

interface ModalProps {
  first: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ first, title, message, onConfirm }) => {
  useEffect(() => {
    const handlePopState = () => {
      if (!first) window.history.pushState(null, '', '/');
      onConfirm();
    };

    window.addEventListener('popstate', handlePopState);

    if (!first) window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [first, onConfirm]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        <p>{message}</p>
        <Button onClick={onConfirm} className={styles.modal__button}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default Modal;
