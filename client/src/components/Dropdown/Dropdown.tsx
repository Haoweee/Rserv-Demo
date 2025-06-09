import React, { useRef, useState, useEffect } from 'react';
import styles from './Dropdown.module.scss';

interface DropdownProps {
  label: string;
  placeholder?: string;
  options: { label: string; value: string; disabled?: boolean }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  renderOption?: (option: { label: string; value: string; disabled?: boolean }) => React.ReactNode;
}

export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  className,
  required = false,
  renderOption,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (selectedValue: string, isDisabled: boolean) => {
    if (isDisabled) return;
    onChange(selectedValue);
    setOpen(false);
  };

  return (
    <div className={`${styles.dropdown} ${className || ''}`}>
      <label>
        {label}
        {required && <span className={styles.asterisk}>*</span>}
      </label>
      <button onClick={() => setOpen(!open)} className={styles.dropdownButton}>
        {options.find(option => option.value === value)?.label || placeholder || 'Select'}
      </button>
      {open && (
        <div className={styles.dropdownList}>
          {options.map(option => (
            <span
              key={option.value}
              onClick={() => handleOptionClick(option.value, option.disabled ?? false)}
              className={`${styles.dropdownItem} ${
                option.value === value ? styles.selectedItem : ''
              } ${option.disabled ? styles.disabledItem : ''}`}
              aria-disabled={option.disabled}
            >
              {renderOption ? renderOption(option) : option.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
