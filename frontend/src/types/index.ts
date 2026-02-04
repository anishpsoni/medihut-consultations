export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  specialty: string;
  qualification: string;
  experience_years: number;
  registration_number?: string;
  bio?: string;
  consultation_fee: number;
  languages?: string[];
  is_verified: boolean;
  users?: User;
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  time_slot: string;
  reason?: string;
  status: AppointmentStatus;
  created_at: string;
  patient?: User;
  doctor?: Doctor;
}

export interface Consultation {
  id: string;
  appointment_id: string;
  meet_link: string;
  status: string;
  started_at?: string;
  ended_at?: string;
  notes?: string;
  created_at: string;
  appointment?: Appointment;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  consultation_id: string;
  doctor_id: string;
  patient_id: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
  created_at: string;
  doctor?: Doctor;
  patient?: User;
}

export interface ChatMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: User;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_id?: string;
  appointment_id: string;
  patient_id: string;
  amount: number;
  currency: string;
  status: string;
  signature?: string;
  created_at: string;
}
