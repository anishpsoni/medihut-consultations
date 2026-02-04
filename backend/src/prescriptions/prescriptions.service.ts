import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePrescriptionDto } from './dto/prescriptions.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PrescriptionsService {
  constructor(private supabaseService: SupabaseService) {}

  async createPrescription(doctorId: string, createPrescriptionDto: CreatePrescriptionDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        id: uuidv4(),
        consultation_id: createPrescriptionDto.consultation_id,
        doctor_id: doctorId,
        patient_id: createPrescriptionDto.patient_id,
        medications: createPrescriptionDto.medications,
        diagnosis: createPrescriptionDto.diagnosis,
        notes: createPrescriptionDto.notes,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create prescription');
    }

    return data;
  }

  async getPrescriptionById(prescriptionId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctors(*,users(*)),
        patient:users!prescriptions_patient_id_fkey(*),
        consultation:consultations(*)
      `)
      .eq('id', prescriptionId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Prescription not found');
    }

    return data;
  }

  async getPatientPrescriptions(patientId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctors(*,users(*))
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException('Failed to fetch prescriptions');
    }

    return data;
  }

  async getDoctorPrescriptions(doctorId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:users!prescriptions_patient_id_fkey(*)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException('Failed to fetch prescriptions');
    }

    return data;
  }
}
