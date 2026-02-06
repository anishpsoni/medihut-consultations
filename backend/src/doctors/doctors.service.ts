import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDoctorProfileDto, UpdateDoctorProfileDto, SetAvailabilityDto } from './dto/doctors.dto';

// Mock Data
const MOCK_DOCTORS = [
  {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    user_id: 'user_1',
    full_name: 'Dr. Sarah Wilson',
    specialty: 'Cardiologist',
    qualification: 'MD, FACC',
    experience_years: 15,
    bio: 'Dr. Sarah Wilson is a leading cardiologist with over 15 years of experience in treating complex heart conditions. She specializes in preventive cardiology and heart failure management.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 124,
    consultation_fee: 600,
    is_verified: true,
    available: true,
    languages: ['English', 'Spanish'],
  },
  {
    id: 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e',
    user_id: 'user_2',
    full_name: 'Dr. James Chen',
    specialty: 'Dermatologist',
    qualification: 'MD, FAAD',
    experience_years: 10,
    bio: 'Dr. James Chen is a board-certified dermatologist known for his expertise in cosmetic dermatology and laser treatments. He is dedicated to helping patients achieve healthy, radiant skin.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.8,
    review_count: 89,
    consultation_fee: 550,
    is_verified: true,
    available: true,
    languages: ['English', 'Mandarin'],
  },
  {
    id: 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f',
    user_id: 'user_3',
    full_name: 'Dr. Emily Brooks',
    specialty: 'General Physician',
    qualification: 'MBBS, MD',
    experience_years: 8,
    bio: 'Dr. Emily Brooks provides comprehensive primary care services. She focuses on holistic health and wellness, offering personalized treatment plans for families.',
    image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.7,
    review_count: 215,
    consultation_fee: 400,
    is_verified: true,
    available: false,
    languages: ['English'],
  },
  {
    id: 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a',
    user_id: 'user_4',
    full_name: 'Dr. Michael Patel',
    specialty: 'Neurologist',
    qualification: 'MD, PhD',
    experience_years: 20,
    bio: 'Dr. Michael Patel is a renowned neurologist specializing in stroke rehabilitation and neurodegenerative diseases. He advocates for early intervention and patient education.',
    image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 310,
    consultation_fee: 700,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi', 'Gujarati'],
  },
  {
    id: 'e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b',
    user_id: 'user_5',
    full_name: 'Dr. Lisa Wong',
    specialty: 'Pediatrician',
    qualification: 'MD, FAAP',
    experience_years: 12,
    bio: 'Dr. Lisa Wong is a compassionate pediatrician who loves working with children. She specializes in developmental pediatrics and childhood nutrition.',
    image_url: 'https://images.unsplash.com/photo-1622253696505-68db74182260?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 180,
    consultation_fee: 500,
    is_verified: true,
    available: true,
    languages: ['English', 'Cantonese'],
  },
  {
    id: 'f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c',
    user_id: 'user_6',
    full_name: 'Dr. Robert Fox',
    specialty: 'Orthopedic',
    qualification: 'MS, Ortho',
    experience_years: 18,
    bio: 'Dr. Robert Fox is an expert in sports medicine and joint replacement surgeries. He works with athletes to ensure quick and safe recovery.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.8,
    review_count: 156,
    consultation_fee: 650,
    is_verified: true,
    available: true,
    languages: ['English'],
  },
  {
    id: 'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
    user_id: 'user_7',
    full_name: 'Dr. Amanda Lee',
    specialty: 'Psychiatrist',
    qualification: 'MD, Psychiatry',
    experience_years: 14,
    bio: 'Dr. Amanda Lee specializes in anxiety and depression management. She uses a combination of therapy and medication to help her patients.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 240,
    consultation_fee: 750,
    is_verified: true,
    available: true,
    languages: ['English', 'Korean'],
  },
  {
    id: 'b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e',
    user_id: 'user_8',
    full_name: 'Dr. David Kim',
    specialty: 'Dentist',
    qualification: 'BDS, MDS',
    experience_years: 9,
    bio: 'Dr. David Kim is a cosmetic dentist known for his detailed work in smile designing and implants.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.7,
    review_count: 98,
    consultation_fee: 450,
    is_verified: true,
    available: true,
    languages: ['English', 'Korean'],
  },
  {
    id: 'c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f',
    user_id: 'user_9',
    full_name: 'Dr. Jennifer White',
    specialty: 'Gynecologist',
    qualification: 'MD, OBGYN',
    experience_years: 16,
    bio: 'Dr. Jennifer White provides comprehensive women\'s health care, from regular checkups to high-risk pregnancy management.',
    image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 312,
    consultation_fee: 600,
    is_verified: true,
    available: true,
    languages: ['English'],
  },
  {
    id: 'd0e1f2a3-b4c5-4d6e-7f8a-9b0c1d2e3f4a',
    user_id: 'user_10',
    full_name: 'Dr. Thomas Brown',
    specialty: 'ENT Specialist',
    qualification: 'MS, ENT',
    experience_years: 11,
    bio: 'Dr. Thomas Brown specializes in sinus disorders and sleep apnea. He offers both medical and surgical solutions.',
    image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.6,
    review_count: 87,
    consultation_fee: 500,
    is_verified: true,
    available: true,
    languages: ['English'],
  },
  {
    id: '11',
    user_id: 'user_11',
    full_name: 'Dr. Priya Sharma',
    specialty: 'Endocrinologist',
    qualification: 'MD, DM (Endocrinology)',
    experience_years: 13,
    bio: 'Dr. Priya Sharma is an expert in diabetes management, thyroid disorders, and hormonal imbalances.',
    image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.8,
    review_count: 195,
    consultation_fee: 600,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi'],
  },
  {
    id: '12',
    user_id: 'user_12',
    full_name: 'Dr. Rajesh Kumar',
    specialty: 'Gastroenterologist',
    qualification: 'MD, DM (Gastro)',
    experience_years: 17,
    bio: 'Dr. Rajesh Kumar specializes in digestive system disorders, liver diseases, and endoscopic procedures.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.7,
    review_count: 168,
    consultation_fee: 700,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi', 'Tamil'],
  },
  {
    id: '13',
    user_id: 'user_13',
    full_name: 'Dr. Sneha Reddy',
    specialty: 'Ophthalmologist',
    qualification: 'MS (Ophthalmology)',
    experience_years: 9,
    bio: 'Dr. Sneha Reddy offers comprehensive eye care including cataract surgery, LASIK, and treatment for glaucoma.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 143,
    consultation_fee: 500,
    is_verified: true,
    available: true,
    languages: ['English', 'Telugu', 'Hindi'],
  },
  {
    id: '14',
    user_id: 'user_14',
    full_name: 'Dr. Amit Singh',
    specialty: 'Urologist',
    qualification: 'MCh (Urology)',
    experience_years: 14,
    bio: 'Dr. Amit Singh is a skilled urologist specializing in kidney stones, prostate conditions, and urological cancers.',
    image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.6,
    review_count: 112,
    consultation_fee: 650,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi'],
  },
  {
    id: '15',
    user_id: 'user_15',
    full_name: 'Dr. Kavya Nair',
    specialty: 'Dermatologist',
    qualification: 'MD, DDV',
    experience_years: 8,
    bio: 'Dr. Kavya Nair specializes in skin allergies, acne treatment, hair loss, and aesthetic dermatology.',
    image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.8,
    review_count: 201,
    consultation_fee: 550,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi', 'Malayalam'],
  },
  {
    id: '16',
    user_id: 'user_16',
    full_name: 'Dr. Vikram Mehta',
    specialty: 'Pulmonologist',
    qualification: 'MD, DM (Pulmonology)',
    experience_years: 12,
    bio: 'Dr. Vikram Mehta treats respiratory diseases including asthma, COPD, and sleep disorders.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.7,
    review_count: 134,
    consultation_fee: 600,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi', 'Gujarati'],
  },
  {
    id: '17',
    user_id: 'user_17',
    full_name: 'Dr. Ananya Das',
    specialty: 'Rheumatologist',
    qualification: 'MD, DM (Rheumatology)',
    experience_years: 10,
    bio: 'Dr. Ananya Das is an expert in autoimmune diseases, arthritis, and joint disorders.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.8,
    review_count: 89,
    consultation_fee: 650,
    is_verified: true,
    available: true,
    languages: ['English', 'Bengali', 'Hindi'],
  },
  {
    id: '18',
    user_id: 'user_18',
    full_name: 'Dr. Karan Joshi',
    specialty: 'Nephrologist',
    qualification: 'MD, DM (Nephrology)',
    experience_years: 15,
    bio: 'Dr. Karan Joshi specializes in kidney diseases, dialysis, and kidney transplant management.',
    image_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 157,
    consultation_fee: 700,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    id: '19',
    user_id: 'user_19',
    full_name: 'Dr. Meera Iyer',
    specialty: 'Nutritionist',
    qualification: 'MSc (Nutrition), PhD',
    experience_years: 7,
    bio: 'Dr. Meera Iyer provides personalized diet plans for weight management, diabetes, and lifestyle diseases.',
    image_url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.7,
    review_count: 223,
    consultation_fee: 400,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi', 'Tamil'],
  },
  {
    id: '20',
    user_id: 'user_20',
    full_name: 'Dr. Arun Kapoor',
    specialty: 'Oncologist',
    qualification: 'MD, DM (Oncology)',
    experience_years: 18,
    bio: 'Dr. Arun Kapoor is a leading oncologist specializing in cancer treatment, chemotherapy, and immunotherapy.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800&h=800',
    rating: 4.9,
    review_count: 267,
    consultation_fee: 800,
    is_verified: true,
    available: true,
    languages: ['English', 'Hindi', 'Punjabi'],
  },
];

@Injectable()
export class DoctorsService {
  constructor(private supabaseService: SupabaseService) { }

  async createDoctorProfile(userId: string, createDoctorDto: CreateDoctorProfileDto) {
    // Mock implementation for creation
    return {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      ...createDoctorDto,
      is_verified: false,
    };
  }

  async getDoctorProfile(doctorId: string) {
    const doctor = MOCK_DOCTORS.find(d => d.id === doctorId);

    if (!doctor) {
      // Fallback to a generic mock if ID not found, for testing flexibility
      if (doctorId === 'mock-id') return MOCK_DOCTORS[0];
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async getDoctorByUserId(userId: string) {
    const doctor = MOCK_DOCTORS.find(d => d.user_id === userId);
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }
    return doctor;
  }

  async updateDoctorProfile(doctorId: string, updateDoctorDto: UpdateDoctorProfileDto) {
    const doctorIndex = MOCK_DOCTORS.findIndex(d => d.id === doctorId);
    if (doctorIndex === -1) throw new NotFoundException('Doctor not found');

    // In a real app we'd update DB in memory for this session
    return { ...MOCK_DOCTORS[doctorIndex], ...updateDoctorDto };
  }

  async getAllDoctors(specialty?: string, isVerified?: boolean) {
    let doctors = MOCK_DOCTORS;

    if (specialty) {
      doctors = doctors.filter(d => d.specialty.toLowerCase() === specialty.toLowerCase());
    }

    if (isVerified !== undefined) {
      doctors = doctors.filter(d => d.is_verified === isVerified);
    }

    return doctors;
  }

  async setAvailability(doctorId: string, availabilityDto: SetAvailabilityDto) {
    return {
      id: 'avail_1',
      doctor_id: doctorId,
      ...availabilityDto
    };
  }

  async getAvailability(doctorId: string, date?: string) {
    // Return mock slots
    return [
      { id: '1', time: '09:00 AM', available: true },
      { id: '2', time: '10:00 AM', available: false },
      { id: '3', time: '11:00 AM', available: true },
      { id: '4', time: '02:00 PM', available: true },
      { id: '5', time: '03:30 PM', available: true },
    ];
  }

  async verifyDoctor(doctorId: string, isVerified: boolean) {
    return { id: doctorId, is_verified: isVerified };
  }
}
