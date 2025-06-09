import { useState } from 'react';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import styles from '../Reservation.module.scss';
import type { AddTableModalProps } from '../../../../types/ReservationData';

export default function AddTableModal({
  newTable,
  setNewTable,
  onSave,
  onClose,
}: AddTableModalProps) {
  const [tableCountError, setTableCountError] = useState<string | null>(null);
  const [maxSeatsError, setMaxSeatsError] = useState<string | null>(null);
  const [minSeatsError, setMinSeatsError] = useState<string | null>(null);

  const validateAndSave = () => {
    let hasError = false;

    if (!newTable.tableCount || newTable.tableCount <= 0) {
      setTableCountError('Enter a positive number');
      hasError = true;
    } else {
      setTableCountError(null);
    }

    if (!newTable.maxSeats || newTable.maxSeats <= 0) {
      setMaxSeatsError('Enter a positive number');
      hasError = true;
    } else {
      setMaxSeatsError(null);
    }

    if (!newTable.minSeats || newTable.minSeats <= 0 || newTable.minSeats > newTable.maxSeats) {
      setMinSeatsError('Enter a positive number ≤ max seats');
      hasError = true;
    } else {
      setMinSeatsError(null);
    }

    if (!hasError) {
      onSave();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 w-[300px] rounded-xl border border-solid border-stone-400 shadow-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-center text-lg">Add Table</h2>

        {/* Table Count Input */}
        <Input
          label="Count"
          type="number"
          value={newTable.tableCount.toString()}
          onChange={e =>
            setNewTable({
              ...newTable,
              tableCount: parseInt(e.target.value, 10),
            })
          }
          inputClassName={styles.inputSection}
          className={styles.inputSection__input}
        />
        <div className="text-red-500 text-sm text-center" style={{ height: '1rem' }}>
          {tableCountError}
        </div>

        {/* Min Seats Input */}
        <Input
          label="Min Seats"
          type="number"
          value={newTable.minSeats.toString()}
          onChange={e =>
            setNewTable({
              ...newTable,
              minSeats: parseInt(e.target.value, 10),
            })
          }
          inputClassName={styles.inputSection}
          className={styles.inputSection__input}
        />
        <div className="text-red-500 text-sm text-center" style={{ height: '1rem' }}>
          {minSeatsError}
        </div>

        {/* Max Seats Input */}
        <Input
          label="Max Seats"
          type="number"
          value={newTable.maxSeats.toString()}
          onChange={e =>
            setNewTable({
              ...newTable,
              maxSeats: parseInt(e.target.value, 10),
            })
          }
          inputClassName={styles.inputSection}
          className={styles.inputSection__input}
        />
        <div className="text-red-500 text-sm text-center" style={{ height: '1rem' }}>
          {maxSeatsError}
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <Button onClick={validateAndSave} className={styles.saveButton}>
            Save
          </Button>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
