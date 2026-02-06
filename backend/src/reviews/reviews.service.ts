import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface CreateReviewDto {
    doctor_id: string;
    patient_id: string;
    rating: number;
    comment: string;
}

const MOCK_REVIEWS = [
    {
        id: '1',
        doctor_id: '1',
        patient_id: 'user_123',
        patient_name: 'John Doe',
        rating: 5,
        comment: 'Dr. Wilson was incredibly attentive and explained everything clearly. Highly recommended!',
        date: '2025-10-15T10:30:00Z',
    },
    {
        id: '2',
        doctor_id: '1',
        patient_id: 'user_456',
        patient_name: 'Sarah Smith',
        rating: 4,
        comment: 'Great experience, but the wait time was a bit long.',
        date: '2025-11-20T14:15:00Z',
    },
    {
        id: '3',
        doctor_id: '2',
        patient_id: 'user_789',
        patient_name: 'Mike Johnson',
        rating: 5,
        comment: 'Saved my skin! Literally. Best dermatologist in town.',
        date: '2026-01-05T09:00:00Z',
    }
];

@Injectable()
export class ReviewsService {
    async getReviewsByDoctorId(doctorId: string) {
        return MOCK_REVIEWS.filter(r => r.doctor_id === doctorId);
    }

    async createReview(dto: CreateReviewDto) {
        const newReview = {
            id: uuidv4(),
            doctor_id: dto.doctor_id,
            patient_id: dto.patient_id,
            patient_name: 'Anonymous User', // Mock name
            rating: dto.rating,
            comment: dto.comment,
            date: new Date().toISOString(),
        };
        MOCK_REVIEWS.push(newReview);
        return newReview;
    }
}
