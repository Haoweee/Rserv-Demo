import { ChangeEvent } from 'react';
import { Plus, Minus } from 'lucide-react';

import styles from './SeatInput.module.scss';

interface InputProps {
  label: string;
  min?: boolean;
  subtitle?: string;
  placeholder?: string;
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  required?: boolean;
}

export default function SeatInput({
  label,
  min,
  subtitle,
  placeholder,
  value,
  onChange,
  className,
  inputClassName,
  required = false,
}: InputProps) {
  const handleDecrement = () => {
    const newValue = Math.max(parseInt(value, 10) - 1, 0);
    onChange(newValue.toString());
  };

  const handleIncrement = () => {
    const newValue = parseInt(value, 10) + 1;
    onChange(newValue.toString());
  };

  return (
    <div className={`${styles.inputWrapper} ${className || ''}`}>
      <label className={styles.label}>
        {label}
        {/* {min && <span className={styles.min}>(Min: 2)</span>} */}
        {required && <span className={styles.asterisk}>*</span>}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </label>
      <div className={styles.inputContainer}>
        <button type="button" onClick={handleDecrement} className={styles.adderButton}>
          <Minus size={16} />
        </button>
        <input
          placeholder={placeholder}
          type="number"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const newValue = Math.max(parseInt(e.target.value, 10) || 0, 0);
            onChange(newValue.toString());
          }}
          className={`${styles.inputField} ${inputClassName || ''}`}
        />
        <button type="button" onClick={handleIncrement} className={styles.adderButton}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
