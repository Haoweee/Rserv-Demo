export const SGTToUTC = (isoString: string) => {
  const date = new Date(isoString);
  const sgtOffset = 8;
  const sgtDate = new Date(date.getTime() - sgtOffset * 60 * 60 * 1000);

  return sgtDate.toISOString();
};

export const ISOTo12HourSGT = (isoString: string) => {
  const date = new Date(isoString);
  const sgtOffset = 8;
  const sgtDate = new Date(date.getTime() + sgtOffset * 60 * 60 * 1000);

  let hours = sgtDate.getUTCHours();
  const minutes = sgtDate.getUTCMinutes();
  const meridian = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${formattedHours}:${String(minutes).padStart(2, '0')} ${meridian}`;
};

export const extractDateAndTime = (datetime: string): { date: string; time: string } => {
  const sgt = new Date(
    new Date(datetime)
      .toLocaleString('en-US', {
        timeZone: 'Asia/Singapore',
      })
      .toString()
  );

  const [datePart, timePart] = sgt.toISOString().split('T');
  const [year, month, day] = datePart.split('-');

  const formattedDate = `${month}/${day}/${year.slice(-2)}`;

  return { date: formattedDate, time: ISOTo12HourSGT(datetime) };
};

export const combineDateTimeToISO = (date: string, time: string): string => {
  const [timePart, meridian] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (meridian === 'PM' && hours !== 12) {
    hours += 12;
  } else if (meridian === 'AM' && hours === 12) {
    hours = 0;
  }

  const sgt = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:00.000Z`;

  return sgt;
};

export const validateAndFormatTime = (input: string): string | null => {
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i;

  if (!timeRegex.test(input)) {
    return null;
  }

  return input;
};
