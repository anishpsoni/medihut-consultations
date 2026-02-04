import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AdminService {
  constructor(private supabaseService: SupabaseService) {}

  async getDashboardStats() {
    const supabase = this.supabaseService.getAdminClient();

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get total patients
    const { count: totalPatients } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient');

    // Get total doctors
    const { count: totalDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });

    // Get verified doctors
    const { count: verifiedDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true);

    // Get pending doctors
    const { count: pendingDoctors } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', false);

    // Get total appointments
    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Get completed consultations
    const { count: completedConsultations } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // Get total revenue from completed payments
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

    return {
      totalUsers,
      totalPatients,
      totalDoctors,
      verifiedDoctors,
      pendingDoctors,
      totalAppointments,
      completedConsultations,
      totalRevenue,
    };
  }

  async getAllUsers(page = 1, limit = 20, role?: string) {
    const supabase = this.supabaseService.getAdminClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new BadRequestException('Failed to fetch users');
    }

    return {
      users: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getPendingDoctors() {
    const supabase = this.supabaseService.getAdminClient();

    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users(*)
      `)
      .eq('is_verified', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw new BadRequestException('Failed to fetch pending doctors');
    }

    return data;
  }

  async deleteUser(userId: string) {
    const supabase = this.supabaseService.getAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new BadRequestException('Failed to delete user');
    }

    return { message: 'User deleted successfully' };
  }
}
