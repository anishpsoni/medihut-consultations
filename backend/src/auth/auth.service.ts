import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) { }

  async signUp(signUpDto: SignUpDto) {
    // MOCK IMPLEMENTATION FOR DEMO
    const mockUser = {
      id: 'mock-user-id-' + Date.now(),
      email: signUpDto.email,
      role: signUpDto.role || 'authenticated',
    };

    const mockSession = {
      access_token: 'mock-access-token-' + Date.now(),
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    };

    const profile = {
      id: mockUser.id,
      email: signUpDto.email,
      full_name: signUpDto.fullName,
      role: signUpDto.role || UserRole.PATIENT,
      phone: signUpDto.phone,
      created_at: new Date().toISOString(),
    };

    return {
      user: mockUser,
      profile,
      session: mockSession,
    };
  }

  async signIn(signInDto: SignInDto) {
    // MOCK IMPLEMENTATION FOR DEMO
    const mockUser = {
      id: 'mock-user-id-signin',
      email: signInDto.email,
      role: 'authenticated',
    };

    const mockSession = {
      access_token: 'mock-access-token-signin',
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    };

    const profile = {
      id: mockUser.id,
      email: signInDto.email,
      full_name: 'Minhas Soni', // Mock Name
      role: UserRole.PATIENT,
      created_at: new Date().toISOString(),
    };

    return {
      user: mockUser,
      profile,
      session: mockSession,
    };
  }

  async signOut(accessToken: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return { message: 'Signed out successfully' };
  }

  async getCurrentUser(accessToken: string) {
    const supabase = this.supabaseService.getClient();

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return { user, profile };
  }

  async verifyToken(token: string) {
    const supabase = this.supabaseService.getClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return user;
  }
}
