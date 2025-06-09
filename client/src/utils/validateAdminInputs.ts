export interface ValidationErrors {
  startTimeError?: string | null;
  endTimeError?: string | null;
  bufferError?: string | null;
  tableCountError?: string | null;
  maxSeatsError?: string | null;
  minSeatsError?: string | null;
}

export const validateInputs = (
  editedStartTime: string,
  editedEndTime: string,
  editedBuffer: string,
  validateAndFormatTime: (input: string) => string | null
): { errors: ValidationErrors; isValid: boolean } => {
  let hasError = false;
  const errors: ValidationErrors = {
    startTimeError: null,
    endTimeError: null,
    bufferError: null,
  };

  // Validate Start Time
  if (!editedStartTime.trim()) {
    errors.startTimeError = 'Field is required';
    hasError = true;
  } else if (!validateAndFormatTime(editedStartTime)) {
    errors.startTimeError = 'Invalid format';
    hasError = true;
  }

  // Validate End Time
  if (!editedEndTime.trim()) {
    errors.endTimeError = 'Field is required';
    hasError = true;
  } else if (!validateAndFormatTime(editedEndTime)) {
    errors.endTimeError = 'Invalid format';
    hasError = true;
  }

  // Validate that Start Time is before End Time
  // if (!hasError && editedStartTime >= editedEndTime) {
  //   errors.startTimeError = "Start Time must be before End Time";
  //   hasError = true;
  // }

  // Validate Buffer
  if (!editedBuffer.trim()) {
    errors.bufferError = 'Field is required';
    hasError = true;
  } else if (isNaN(Number(editedBuffer))) {
    errors.bufferError = 'Invalid Input';
    hasError = true;
  }

  return { errors, isValid: !hasError };
};

export const validateTableInputs = (
  tableCount: string,
  maxSeats: string,
  minSeats: string
): { errors: ValidationErrors; isValid: boolean } => {
  let hasError = false;
  const errors: ValidationErrors = {
    tableCountError: null,
    maxSeatsError: null,
    minSeatsError: null,
  };

  // Validate Table Count
  if (!tableCount.trim() || isNaN(Number(tableCount)) || Number(tableCount) <= 0) {
    errors.tableCountError = 'Invalid Input';
    hasError = true;
  }

  // Validate Max Seats
  if (!maxSeats.trim() || isNaN(Number(maxSeats)) || Number(maxSeats) <= 0) {
    errors.maxSeatsError = 'Invalid Input';
    hasError = true;
  }

  // Validate Min Seats
  if (
    !minSeats.trim() ||
    isNaN(Number(minSeats)) ||
    Number(minSeats) <= 0 ||
    Number(minSeats) > Number(maxSeats)
  ) {
    errors.minSeatsError = 'Must be a positive number ≤ to max seats';
    hasError = true;
  }

  return { errors, isValid: !hasError };
};
