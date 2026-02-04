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

@Injectable()
export class AppointmentsService {
  constructor(private supabaseService: SupabaseService) {}

  async createAppointment(patientId: string, createAppointmentDto: CreateAppointmentDto) {
    const supabase = this.supabaseService.getClient();

    // Check if slot is available
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', createAppointmentDto.doctor_id)
      .eq('appointment_date', createAppointmentDto.appointment_date)
      .eq('time_slot', createAppointmentDto.time_slot)
      .eq('status', AppointmentStatus.CONFIRMED)
      .single();

    if (existingAppointment) {
      throw new BadRequestException('Time slot is already booked');
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        id: uuidv4(),
        patient_id: patientId,
        doctor_id: createAppointmentDto.doctor_id,
        appointment_date: createAppointmentDto.appointment_date,
        time_slot: createAppointmentDto.time_slot,
        reason: createAppointmentDto.reason,
        status: AppointmentStatus.PENDING,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create appointment');
    }

    return data;
  }

  async getAppointmentById(appointmentId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(*),
        doctor:doctors(*)
      `)
      .eq('id', appointmentId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Appointment not found');
    }

    return data;
  }

  async getPatientAppointments(patientId: string, status?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors(*,users(*))
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException('Failed to fetch appointments');
    }

    return data;
  }

  async getDoctorAppointments(doctorId: string, status?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:users!appointments_patient_id_fkey(*)
      `)
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException('Failed to fetch appointments');
    }

    return data;
  }

  async updateAppointmentStatus(
    appointmentId: string,
    updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('appointments')
      .update({ status: updateStatusDto.status })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to update appointment status');
    }

    return data;
  }

  async cancelAppointment(appointmentId: string) {
    return this.updateAppointmentStatus(appointmentId, {
      status: AppointmentStatus.CANCELLED,
    });
  }
}
