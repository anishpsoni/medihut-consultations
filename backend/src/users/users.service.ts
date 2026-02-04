import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProfileDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserProfile(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('User not found');
    }

    return data;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const supabase = this.supabaseService.getClient();
    
    const { data, error } = await supabase
      .from('users')
      .update(updateProfileDto)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Failed to update profile');
    }

    return data;
  }

  async getAllUsers(role?: string) {
    const supabase = this.supabaseService.getAdminClient();
    
    let query = supabase.from('users').select('*');
    
    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;

    if (error) {
      throw new NotFoundException('Failed to fetch users');
    }

    return data;
  }
}
