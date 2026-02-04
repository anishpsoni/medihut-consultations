import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDoctorProfileDto, UpdateDoctorProfileDto, SetAvailabilityDto } from './dto/doctors.dto';

@Injectable()
export class DoctorsService {
  constructor(private supabaseService: SupabaseService) {}

  async createDoctorProfile(userId: string, createDoctorDto: CreateDoctorProfileDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('doctors')
      .insert({
        user_id: userId,
        ...createDoctorDto,
        is_verified: false,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to create doctor profile');
    }

    return data;
  }

  async getDoctorProfile(doctorId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users (*)
      `)
      .eq('id', doctorId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Doctor not found');
    }

    return data;
  }

  async getDoctorByUserId(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Doctor profile not found');
    }

    return data;
  }

  async updateDoctorProfile(doctorId: string, updateDoctorDto: UpdateDoctorProfileDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('doctors')
      .update(updateDoctorDto)
      .eq('id', doctorId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to update doctor profile');
    }

    return data;
  }

  async getAllDoctors(specialty?: string, isVerified?: boolean) {
    const supabase = this.supabaseService.getClient();

    let query = supabase.from('doctors').select(`
      *,
      users (*)
    `);

    if (specialty) {
      query = query.eq('specialty', specialty);
    }

    if (isVerified !== undefined) {
      query = query.eq('is_verified', isVerified);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException('Failed to fetch doctors');
    }

    return data;
  }

  async setAvailability(doctorId: string, availabilityDto: SetAvailabilityDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('doctor_availability')
      .upsert({
        doctor_id: doctorId,
        ...availabilityDto,
      })
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to set availability');
    }

    return data;
  }

  async getAvailability(doctorId: string, date?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', doctorId);

    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query;

    if (error) {
      throw new BadRequestException('Failed to fetch availability');
    }

    return data;
  }

  async verifyDoctor(doctorId: string, isVerified: boolean) {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('doctors')
      .update({ is_verified: isVerified })
      .eq('id', doctorId)
      .select()
      .single();

    if (error) {
      throw new BadRequestException('Failed to verify doctor');
    }

    return data;
  }
}
