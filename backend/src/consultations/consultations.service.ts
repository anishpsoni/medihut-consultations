import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateConsultationDto, UpdateConsultationDto } from './dto/consultations.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConsultationsService {
  constructor(private supabaseService: SupabaseService) {}

  private generateGoogleMeetLink(): string {
    // Generate a unique Google Meet link
    const meetingCode = uuidv4().substring(0, 10).replace(/-/g, '');
    return `https://meet.google.com/${meetingCode}`;
  }

  async createConsultation(createConsultationDto: CreateConsultationDto) {
    const supabase = this.supabaseService.getClient();

    const meetLink = this.generateGoogleMeetLink();

    const { data, error } = await supabase
      .from('consultations')
      .insert({
        id: uuidv4(),
        appointment_id: createConsultationDto.appointment_id,
        meet_link: meetLink,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create consultation');
    }

    return data;
  }

  async getConsultationById(consultationId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('consultations')
      .select(`
        *,
        appointment:appointments(*)
      `)
      .eq('id', consultationId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Consultation not found');
    }

    return data;
  }

  async getConsultationByAppointmentId(appointmentId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Consultation not found');
    }

    return data;
  }

  async updateConsultation(
    consultationId: string,
    updateConsultationDto: UpdateConsultationDto,
  ) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('consultations')
      .update(updateConsultationDto)
      .eq('id', consultationId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to update consultation');
    }

    return data;
  }

  async startConsultation(consultationId: string) {
    return this.updateConsultation(consultationId, {
      status: 'ongoing',
      started_at: new Date().toISOString(),
    });
  }

  async endConsultation(consultationId: string, notes?: string) {
    return this.updateConsultation(consultationId, {
      status: 'completed',
      ended_at: new Date().toISOString(),
      notes: notes,
    });
  }
}
