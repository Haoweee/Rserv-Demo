import { Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import AddTableModal from '../ReservationModal/AddTables';
import RemoveTableModal from '../ReservationModal/RemoveTables';
import type { Table, ReservationTablesProps } from '../../../../types/ReservationData';

export default function ReservationTables({
  tables,
  handleTableClick,
  addTable,
  removeTable,
}: ReservationTablesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [tableToRemove, setTableToRemove] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState<Table>({
    tableID: tables.length > 0 ? tables[tables.length - 1].tableID + 1 : 1,
    tableCount: 1,
    maxSeats: 4,
    minSeats: 2,
  });

  const openAddModal = () => {
    setNewTable({
      tableID: tables.length > 0 ? tables[tables.length - 1].tableID + 1 : 1,
      tableCount: 1,
      maxSeats: 4,
      minSeats: 2,
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const saveNewTable = async () => {
    await addTable(newTable);
    closeAddModal();
  };

  const openRemoveModal = (table: Table) => {
    setTableToRemove(table);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setTableToRemove(null);
    setShowRemoveModal(false);
  };

  const confirmRemoveTable = async () => {
    if (tableToRemove) {
      await removeTable(tableToRemove);
      closeRemoveModal();
    }
  };

  return (
    <div>
      <div className="relative flex items-center mb-4">
        <h1 className="text-lg">Available Tables</h1>
        <button
          onClick={openAddModal}
          className="absolute right-0 top-0 flex items-center p-1 border border-solid border-stone-400 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          <span className="ml-1 text-sm px-1">Add Table</span>
        </button>
      </div>
      <div className="min-h-fit flex-1 rounded-xl bg-muted/30 md:min-h-min p-4 border border-solid border-stone-200 shadow-md">
        <div className="grid auto-rows-min gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 mb-2">
          {tables.map((table: Table) => (
            <div
              key={table.tableID}
              className="aspect-square rounded-xl bg-muted/30 p-4 cursor-pointer border-2 hover:border-primary/50 flex flex-col justify-center items-center text-center relative"
              onClick={() => handleTableClick(table)}
            >
              <button
                onClick={e => {
                  e.stopPropagation();
                  openRemoveModal(table);
                }}
                className="absolute top-2 left-2 p-1 rounded-lg text-black"
              >
                <Trash className="w-4 h-4 text-red-600" />
              </button>
              <h2 className="text-lg mb-2">Table {table.tableID}</h2>
              <div className="flex flex-col gap-1">
                <p>Count: {table.tableCount}</p>
                <p>
                  Seats: {table.minSeats}-{table.maxSeats}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Conditionally Render AddTableModal */}
        {showAddModal && (
          <AddTableModal
            newTable={newTable}
            setNewTable={setNewTable}
            onSave={saveNewTable}
            onClose={closeAddModal}
          />
        )}

        {/* Conditionally Render RemoveTableModal */}
        {showRemoveModal && tableToRemove && (
          <RemoveTableModal
            table={tableToRemove}
            onConfirm={confirmRemoveTable}
            onClose={closeRemoveModal}
          />
        )}
      </div>
    </div>
  );
}
