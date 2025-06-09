import { useState } from 'react';
import { validateInputs, ValidationErrors } from '../../../../utils/validateAdminInputs';
import Input from '../../../../components/Input/Input';
import Button from '../../../../components/Button/Button';
import styles from '../Reservation.module.scss';
import type { ReservationHeaderProps } from '../../../../types/ReservationData';

export default function ReservationHeader({
  startTime,
  endTime,
  buffer,
  editedStartTime,
  editedEndTime,
  editedBuffer,
  setEditedStartTime,
  setEditedEndTime,
  setEditedBuffer,
  handleSaveSettings,
  validateAndFormatTime,
  sendLoading,
}: ReservationHeaderProps) {
  const [errors, setErrors] = useState<ValidationErrors>({
    startTimeError: null,
    endTimeError: null,
    bufferError: null,
  });

  const validateAndSave = (section: 'startTime' | 'endTime' | 'buffer') => {
    if (section === 'startTime') {
      const { errors, isValid } = validateInputs(
        editedStartTime,
        endTime,
        buffer,
        validateAndFormatTime
      );
      if (isValid) handleSaveSettings('startTime', editedStartTime);
      setErrors(errors);
    }

    if (section === 'endTime') {
      const { errors, isValid } = validateInputs(
        startTime,
        editedEndTime,
        buffer,
        validateAndFormatTime
      );
      if (isValid) handleSaveSettings('endTime', editedEndTime);
      setErrors(errors);
    }

    if (section === 'buffer') {
      const { errors, isValid } = validateInputs(
        startTime,
        endTime,
        editedBuffer,
        validateAndFormatTime
      );
      if (isValid) handleSaveSettings('buffer', editedBuffer);
      setErrors(errors);
    }
  };

  return (
    <div className="flex flex-col justify-center align-middle gap-4 mb-12">
      {/* Header Row */}
      <div className="flex flex-row justify-between items-center whitespace-nowrap gap-4">
        <h1 className="text-lg">Operational Hours</h1>
        <Button
          onClick={() => validateAndSave('startTime')}
          disabled={sendLoading}
          className={styles.saveButton}
        >
          {sendLoading ? 'Save' : 'Save'}
        </Button>
      </div>

      {/* Responsive Grid Layout for Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Time */}
        <div className="flex flex-row sm:flex-col items-center bg-muted/30 p-4 border border-stone-200 shadow-md rounded-xl">
          <label className="text-sm font-medium sm:mb-1 mr-4 sm:mr-0">Open</label>
          <div className="relative flex flex-col flex-1 w-full">
            <Input
              label=""
              value={editedStartTime}
              onChange={e => setEditedStartTime(e.target.value)}
              inputClassName={styles.inputSection}
              className={`${styles.inputSection__input} w-full`}
            />
            {errors.startTimeError && (
              <div className="absolute left-0 top-full mt-1 text-red-500 text-xs">
                {errors.startTimeError}
              </div>
            )}
          </div>
        </div>

        {/* End Time */}
        <div className="flex flex-row sm:flex-col items-center bg-muted/30 p-4 border border-stone-200 shadow-md rounded-xl">
          <label className="text-sm font-medium sm:mb-1 mr-4 sm:mr-0">Close</label>
          <div className="relative flex flex-col flex-1 w-full">
            <Input
              label=""
              value={editedEndTime}
              onChange={e => setEditedEndTime(e.target.value)}
              inputClassName={styles.inputSection}
              className={`${styles.inputSection__input} w-full`}
            />
            {errors.endTimeError && (
              <div className="absolute left-0 top-full mt-1 text-red-500 text-xs">
                {errors.endTimeError}
              </div>
            )}
          </div>
        </div>

        {/* Buffer */}
        <div className="flex flex-row sm:flex-col items-center bg-muted/30 p-4 border border-stone-200 shadow-md rounded-xl">
          <label className="text-sm font-medium sm:mb-1 mr-4 sm:mr-0">Buffer</label>
          <div className="relative flex flex-col flex-1 w-full">
            <Input
              label=""
              value={editedBuffer}
              onChange={e => setEditedBuffer(e.target.value)}
              inputClassName={styles.inputSection}
              className={`${styles.inputSection__input} w-full`}
            />
            {errors.bufferError && (
              <div className="absolute left-0 top-full mt-1 text-red-500 text-xs">
                {errors.bufferError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
