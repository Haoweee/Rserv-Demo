import { ChangeEvent } from 'react';
import styles from './Input.module.scss';

interface InputProps {
  label: string;
  subtitle?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  required?: boolean;
}

export default function Input({
  label,
  subtitle,
  placeholder,
  type = 'text',
  value,
  onChange,
  className,
  inputClassName,
  multiline = false,
  required = false,
}: InputProps) {
  return (
    <div className={`${styles.input} ${className || ''}`}>
      <label>
        {label}
        {required && <span className={styles.asterisk}>*</span>}
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${styles.textarea} ${inputClassName || ''}`}
        />
      ) : (
        <input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          className={`${styles.input} ${inputClassName || ''}`}
        />
      )}
    </div>
  );
}
