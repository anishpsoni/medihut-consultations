import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointments.dto';
import { v4 as uuidv4 } from 'uuid';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// In-memory mock storage
const MOCK_APPOINTMENTS: any[] = [];

@Injectable()
export class AppointmentsService {
  constructor(private supabaseService: SupabaseService) { }

  async createAppointment(patientId: string, createAppointmentDto: CreateAppointmentDto) {
    // Check if slot is available (mock check)
    const existingAppointment = MOCK_APPOINTMENTS.find(
      (a) =>
        a.doctor_id === createAppointmentDto.doctor_id &&
        a.appointment_date === createAppointmentDto.appointment_date &&
        a.time_slot === createAppointmentDto.time_slot &&
        a.status === AppointmentStatus.CONFIRMED
    );

    if (existingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    const newAppointment = {
      id: uuidv4(),
      patient_id: patientId,
      doctor_id: createAppointmentDto.doctor_id,
      appointment_date: createAppointmentDto.appointment_date,
      time_slot: createAppointmentDto.time_slot,
      reason: createAppointmentDto.reason,
      status: AppointmentStatus.CONFIRMED, // Auto-confirm for demo
      created_at: new Date().toISOString(),
      meet_link: `https://meet.google.com/${Math.random().toString(36).substr(2, 3)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 3)}`,
    };

    MOCK_APPOINTMENTS.push(newAppointment);

    // Mock delay to simulate network
    // await new Promise(resolve => setTimeout(resolve, 500));

    return newAppointment;
  }

  async getAppointmentById(appointmentId: string) {
    const appointment = MOCK_APPOINTMENTS.find((a) => a.id === appointmentId);

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Populate (mock)
    return {
      ...appointment,
      doctor: { full_name: 'Dr. Mock Doctor', specialty: 'General' }, // Simplified mock population
      patient: { full_name: 'Mock Patient' },
    };
  }

  async getPatientAppointments(patientId: string, status?: string) {
    let appointments = MOCK_APPOINTMENTS.filter((a) => a.patient_id === patientId);

    if (status) {
      appointments = appointments.filter((a) => a.status === status);
    }

    // Reverse sort by date (simplified string comparison)
    return appointments.sort((a, b) => b.appointment_date.localeCompare(a.appointment_date));
  }

  async getDoctorAppointments(doctorId: string, status?: string) {
    let appointments = MOCK_APPOINTMENTS.filter((a) => a.doctor_id === doctorId);

    if (status) {
      appointments = appointments.filter((a) => a.status === status);
    }

    return appointments.sort((a, b) => b.appointment_date.localeCompare(a.appointment_date));
  }

  async updateAppointmentStatus(
    appointmentId: string,
    updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    const index = MOCK_APPOINTMENTS.findIndex((a) => a.id === appointmentId);
    if (index === -1) {
      throw new BadRequestException('Appointment not found');
    }

    MOCK_APPOINTMENTS[index].status = updateStatusDto.status;
    return MOCK_APPOINTMENTS[index];
  }

  async cancelAppointment(appointmentId: string) {
    return this.updateAppointmentStatus(appointmentId, {
      status: AppointmentStatus.CANCELLED,
    });
  }
}
