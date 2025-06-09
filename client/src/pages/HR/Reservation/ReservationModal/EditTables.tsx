import { useState } from 'react';
import { validateTableInputs } from '../../../../utils/validateAdminInputs';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import styles from '../Reservation.module.scss';
import type { EditTableModalProps } from '../../../../types/ReservationData';

export default function ReservationModal({
  table,
  setSelectedTable,
  tables,
  setTables,
  handleModalSave,
}: EditTableModalProps) {
  const [editedTableCount, setEditedTableCount] = useState(table.tableCount.toString());
  const [editedMaxSeats, setEditedMaxSeats] = useState(table.maxSeats.toString());
  const [editedMinSeats, setEditedMinSeats] = useState(table.minSeats.toString());

  const [tableCountError, setTableCountError] = useState<string | null>(null);
  const [maxSeatsError, setMaxSeatsError] = useState<string | null>(null);
  const [minSeatsError, setMinSeatsError] = useState<string | null>(null);

  const closeModal = () => setSelectedTable(null);

  const validateAndSave = () => {
    const { errors, isValid } = validateTableInputs(
      editedTableCount,
      editedMaxSeats,
      editedMinSeats
    );

    setTableCountError(errors.tableCountError || null);
    setMaxSeatsError(errors.maxSeatsError || null);
    setMinSeatsError(errors.minSeatsError || null);

    if (isValid) {
      const updatedTables = tables.map(t =>
        t.tableID === table.tableID
          ? {
              ...t,
              tableCount: parseInt(editedTableCount, 10),
              maxSeats: parseInt(editedMaxSeats, 10),
              minSeats: parseInt(editedMinSeats, 10),
            }
          : t
      );

      handleModalSave(updatedTables);
      closeModal();
    }
  };

  const handleNumericInputChange = (value: string, setState: (value: string) => void) => {
    if (/^\d*$/.test(value)) {
      setState(value);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 w-[300px] rounded-xl border border-solid border-black">
        <h2 className="text-center text-lg">Edit Table {table.tableID}</h2>

        {/* Table Count Input */}
        <Input
          label="Count"
          type="number"
          value={editedTableCount}
          onChange={e => handleNumericInputChange(e.target.value, setEditedTableCount)}
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
          value={editedMinSeats}
          onChange={e => handleNumericInputChange(e.target.value, setEditedMinSeats)}
          inputClassName={styles.inputSection}
          className={styles.inputSection__input}
        />
        <div className="text-red-500 text-sm text-center" style={{ height: '1.25rem' }}>
          {minSeatsError}
        </div>

        {/* Max Seats Input */}
        <Input
          label="Max Seats"
          type="number"
          value={editedMaxSeats}
          onChange={e => handleNumericInputChange(e.target.value, setEditedMaxSeats)}
          inputClassName={styles.inputSection}
          className={styles.inputSection__input}
        />
        <div className="text-red-500 text-sm text-center" style={{ height: '1rem' }}>
          {maxSeatsError}
        </div>

        <Button onClick={validateAndSave} className={styles.saveButton}>
          Save
        </Button>
        <Button onClick={closeModal} className={styles.cancelButton}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
