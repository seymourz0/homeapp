export interface User {
  id: number;
  username: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Photo {
  id: number;
  title: string;
  description: string | null;
  filePath: string;
  contentType: string;
  categoryId: number | null;
  createdAt: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  categoryId: number | null;
  createdAt: string;
}

export interface Warranty {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  expirationDate: string;
  categoryId: number | null;
  createdAt: string;
}

export interface MaintenanceEvent {
  id: number;
  title: string;
  description: string;
  cost: string | null;
  photoIds: number[] | null;
  receiptPhotoIds: number[] | null;
  categoryId: number | null;
  date: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalRecords: number;
  upcomingExpirations: number;
  photosStored: number;
  maintenanceNotes: number;
  lastNoteDate: string | null;
}
