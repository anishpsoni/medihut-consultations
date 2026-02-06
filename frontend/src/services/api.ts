import { Doctor, User, Appointment } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!res.ok) {
            // Try to parse error message
            try {
                const errorData = await res.json();
                throw new Error(errorData.message || `API call failed: ${res.statusText}`);
            } catch (e: any) {
                throw new Error(e.message || `API call failed: ${res.statusText}`);
            }
        }

        return res.json();
    }

    // Auth
    async signUp(data: any): Promise<any> {
        return this.fetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async signIn(data: any): Promise<any> {
        return this.fetch('/auth/signin', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async signOut(): Promise<void> {
        // Just clear local state, maybe call backend
        return;
    }

    async getCurrentUser(): Promise<any> {
        // Mock check or call backend
        // For now return null or try to get from local storage if needed
        // But auth store handles persistence.
        return null;
    }

    // Doctors
    async getDoctors(specialty?: string): Promise<Doctor[]> {
        const query = specialty ? `?specialty=${specialty}` : '';
        return this.fetch<Doctor[]>(`/doctors${query}`);
    }

    async getDoctorById(id: string): Promise<Doctor> {
        return this.fetch<Doctor>(`/doctors/${id}`);
    }

    // Users
    async getUserProfile(id: string): Promise<User> {
        return this.fetch<User>(`/users/${id}`);
    }

    // Appointments
    async createAppointment(appointmentData: any): Promise<Appointment> {
        // Extract patientId from appointmentData
        const { patientId, ...dto } = appointmentData;

        // Send DTO fields + patientId in body
        return this.fetch<Appointment>('/appointments', {
            method: 'POST',
            body: JSON.stringify({
                ...dto,
                patientId, // Backend controller expects this
            }),
        });
    }

    // Reviews
    async getReviews(doctorId: string): Promise<any[]> {
        return this.fetch<any[]>(`/reviews/doctor/${doctorId}`);
    }

    async createReview(reviewData: any): Promise<any> {
        return this.fetch('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }
}

export const api = new ApiService();
