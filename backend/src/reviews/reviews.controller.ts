import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService, CreateReviewDto } from './reviews.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Keeping open for testing if needed

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Get('doctor/:doctorId')
    async getReviews(@Param('doctorId') doctorId: string) {
        return this.reviewsService.getReviewsByDoctorId(doctorId);
    }

    @Post()
    async createReview(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.createReview(createReviewDto);
    }
}
