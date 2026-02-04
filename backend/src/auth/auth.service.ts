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
  constructor(private supabaseService: SupabaseService) {}

  async signUp(signUpDto: SignUpDto) {
    const supabase = this.supabaseService.getClient();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signUpDto.email,
      password: signUpDto.password,
    });

    if (authError) {
      throw new UnauthorizedException(authError.message);
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: signUpDto.email,
        full_name: signUpDto.fullName,
        role: signUpDto.role || UserRole.PATIENT,
        phone: signUpDto.phone,
      })
      .select()
      .single();

    if (profileError) {
      // Rollback auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new UnauthorizedException('Failed to create user profile');
    }

    return {
      user: authData.user,
      profile,
      session: authData.session,
    };
  }

  async signIn(signInDto: SignInDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInDto.email,
      password: signInDto.password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: data.user,
      profile,
      session: data.session,
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
