import { useEffect, useState } from 'react';
import {
  useGetReservationSettings,
  useSetReservationSettings,
} from '../../../hooks/HR/useReservationSettings';
import { ISOTo12HourSGT, validateAndFormatTime } from '../../../utils/formatTime';
import { Table } from '../../../types/ReservationData';
// import { ValidationErrors } from '../../../utils/validateAdminInputs';
import ReservationHeader from './ReservationHeader/ReservationHeader';
import ReservationTables from './ReservationTables/ReservationTables';
import ReservationModal from './ReservationModal/EditTables';

export default function Reservation() {
  const { settings, fetchSettings } = useGetReservationSettings();
  const { sendReservationSettings, sendLoading } = useSetReservationSettings();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [buffer, setBuffer] = useState(0);

  const [editedStartTime, setEditedStartTime] = useState('');
  const [editedEndTime, setEditedEndTime] = useState('');
  const [editedBuffer, setEditedBuffer] = useState('');

  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    if (settings) {
      const startTime12Hour = ISOTo12HourSGT(settings.startTime);
      const endTime12Hour = ISOTo12HourSGT(settings.endTime);

      setStartTime(startTime12Hour || '');
      setEndTime(endTime12Hour || '');
      setBuffer(settings.buffer || 0);
      setTables(Array.isArray(settings.tables) ? settings.tables : []);

      setEditedStartTime(startTime12Hour || '');
      setEditedEndTime(endTime12Hour || '');
      setEditedBuffer((settings.buffer || '').toString());
    }
  }, [settings]);

  const handleSaveSettings = (
    section: 'startTime' | 'endTime' | 'buffer' | 'tables',
    data: string | Table[]
  ) => {
    const updatedSettings = {
      startTime,
      endTime,
      buffer: buffer.toString(),
      tables,
    };

    if (section === 'startTime') updatedSettings.startTime = data as string;
    if (section === 'endTime') updatedSettings.endTime = data as string;
    if (section === 'buffer') updatedSettings.buffer = data.toString();
    if (section === 'tables') updatedSettings.tables = data as Table[];

    sendReservationSettings(
      updatedSettings.startTime,
      updatedSettings.endTime,
      parseInt(updatedSettings.buffer, 10),
      updatedSettings.tables,
      fetchSettings
    );
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleModalSave = (updatedTables: Table[]) => {
    setTables(updatedTables);
    handleSaveSettings('tables', updatedTables);
  };

  const addTable = async (newTable: Table) => {
    const updatedTables = [...tables, newTable];
    setTables(updatedTables);
    await handleSaveSettings('tables', updatedTables);
  };

  const removeTable = async (tableToRemove: Table) => {
    const updatedTables = tables.filter(table => table.tableID !== tableToRemove.tableID);
    setTables(updatedTables);
    await handleSaveSettings('tables', updatedTables);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <ReservationHeader
        startTime={startTime}
        endTime={endTime}
        buffer={buffer.toString()}
        editedStartTime={editedStartTime}
        editedEndTime={editedEndTime}
        editedBuffer={editedBuffer}
        setEditedStartTime={setEditedStartTime}
        setEditedEndTime={setEditedEndTime}
        setEditedBuffer={setEditedBuffer}
        handleSaveSettings={handleSaveSettings}
        validateAndFormatTime={validateAndFormatTime}
        sendLoading={sendLoading}
      />
      <ReservationTables
        tables={tables}
        setTables={setTables}
        handleTableClick={handleTableClick}
        handleSaveSettings={updatedTables => handleSaveSettings('tables', updatedTables)}
        addTable={addTable}
        removeTable={removeTable}
      />
      {selectedTable && (
        <ReservationModal
          table={selectedTable}
          setSelectedTable={setSelectedTable}
          tables={tables}
          setTables={setTables}
          handleModalSave={handleModalSave}
        />
      )}
    </div>
  );
}
