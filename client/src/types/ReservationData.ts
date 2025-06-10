export interface ReservationData {
  numGuests: number;
  datetime: Date | null;
  occasion?: string;
  notes?: string;
}

export interface SubmissionData {
  reservationData: ReservationData;
  formData: { cardholderName: string };
}

export interface ReservationSettings {
  startTime: string;
  endTime: string;
  buffer: number;
  tables: number;
}

export interface SummaryReservationData {
  clientSecret: string;
  datetime: string;
  mysqlDatetime: string | Date;
  notes: string;
  numGuests: number;
  occasion: string;
}

export interface ReservationHeaderProps {
  startTime: string;
  endTime: string;
  buffer: string;
  editedStartTime: string;
  editedEndTime: string;
  editedBuffer: string;
  setEditedStartTime: (value: string) => void;
  setEditedEndTime: (value: string) => void;
  setEditedBuffer: (value: string) => void;
  handleSaveSettings: (params: {
    startTime: string;
    endTime: string;
    buffer: string;
    tables?: Table[];
  }) => void;
  validateAndFormatTime: (input: string) => string | null;
  sendLoading: boolean;
}

export interface Table {
  tableID: number;
  tableCount: number;
  maxSeats: number;
  minSeats: number;
}

export interface ReservationTablesProps {
  tables: Table[];
  setTables: (tables: Table[]) => void;
  handleTableClick: (table: Table) => void;
  addTable: (newTable: Table) => void;
  removeTable: (table: Table) => void;
  handleSaveSettings: (section: 'tables', data: Table[]) => void;
}

export interface AddTableModalProps {
  newTable: {
    tableID: number;
    tableCount: number;
    maxSeats: number;
    minSeats: number;
  };
  setNewTable: (table: AddTableModalProps['newTable']) => void;
  onSave: () => void;
  onClose: () => void;
}

export interface EditTableModalProps {
  table: {
    tableID: number;
    tableCount: number;
    maxSeats: number;
    minSeats: number;
  };
  setSelectedTable: (table: any) => void;
  tables: Array<{
    tableID: number;
    tableCount: number;
    maxSeats: number;
    minSeats: number;
  }>;
  setTables: (tables: any) => void;
  handleModalSave: (tables: any) => void;
}

export interface RemoveTableModalProps {
  table: {
    tableID: number;
  } | null;
  onConfirm: () => void;
  onClose: () => void;
}
