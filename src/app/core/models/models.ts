// Központi típusdefiníciók a NailTime alkalmazás entitásaihoz.
// A típusok pontosan tükrözik a docs/DATAMODEL.md tervét, kiegészítve
// néhány gyakorlati mezővel (pl. artistId, photoUrl), amelyek a backend
// integrációhoz szükségesek.

export type UserRole = 'guest' | 'client' | 'admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface NailArtist {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  workingHours: string;
  photoUrl?: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  artistId: number;
}

export interface TimeSlot {
  id: number;
  start: string; // ISO date
  end: string;   // ISO date
  isAvailable: boolean;
  serviceId: number | null;
  appointmentId: number | null;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: number;
  userId: number;
  serviceId: number;
  timeSlotId?: number | null;
  appointmentDate: string;
  status: AppointmentStatus;
  note: string;
  createdAt: string;
}

export interface Review {
  id: number;
  userId: number;
  serviceId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

// Hasznos közös típusok a UI-rétegnek
export interface AppointmentDetailed extends Appointment {
  serviceName?: string;
  userName?: string;
}
