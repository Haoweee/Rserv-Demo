import Button from '../../../../components/Button/Button';
import styles from '../Reservation.module.scss';
import type { RemoveTableModalProps } from '../../../../types/ReservationData';

export default function RemoveTableModal({ table, onConfirm, onClose }: RemoveTableModalProps) {
  if (!table) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 w-[300px] rounded-xl border border-solid border-stone-400 shadow-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-center text-lg">Remove Table</h2>
        <p className="text-center mt-2">Are you sure you want to remove</p>
        <p className="text-center text-xl mt-2">Table {table.tableID}</p>
        <div className="flex flex-col gap-1 mt-4">
          <Button onClick={onConfirm} className={styles.saveButton}>
            Confirm
          </Button>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
