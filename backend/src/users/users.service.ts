import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProfileDto } from './dto/users.dto';

const MOCK_PROFILE = {
  id: 'user_1',
  email: 'anish@medihut.in',
  full_name: 'Anish Soni',
  phone: '+91 9876543210',
  role: 'patient',
  gender: 'Male',
  date_of_birth: '1998-05-15',
  blood_group: 'O+',
  address: '123 Tech Park, Bangalore',
  allergies: ['Peanuts'],
  chronic_conditions: ['None'],
  created_at: new Date().toISOString(),
};

@Injectable()
export class UsersService {
  constructor(private supabaseService: SupabaseService) { }

  async getUserProfile(userId: string) {
    // For manual testing, we return the mock profile regardless of ID to ensure UI works
    return { ...MOCK_PROFILE, id: userId };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return { ...MOCK_PROFILE, id: userId, ...updateProfileDto };
  }

  async getAllUsers(role?: string) {
    // Return a list of mock users
    return [
      { ...MOCK_PROFILE, id: 'user_1', full_name: 'Anish Soni', role: 'patient' },
      { ...MOCK_PROFILE, id: 'user_2', full_name: 'Priya Sharma', role: 'doctor', email: 'priya@medihut.in' },
      { ...MOCK_PROFILE, id: 'user_3', full_name: 'Rahul Verma', role: 'patient', email: 'rahul@gmail.com' },
    ];
  }
}
