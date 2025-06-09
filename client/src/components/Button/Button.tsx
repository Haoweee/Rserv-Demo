import styles from './Button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${className || ''}`}
      disabled={false}
    >
      {children}
    </button>
  );
}
