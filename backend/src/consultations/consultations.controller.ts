import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto, UpdateConsultationDto } from './dto/consultations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private consultationsService: ConsultationsService) {}

  @Post()
  async createConsultation(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.createConsultation(createConsultationDto);
  }

  @Get(':id')
  async getConsultation(@Param('id') id: string) {
    return this.consultationsService.getConsultationById(id);
  }

  @Get('appointment/:appointmentId')
  async getConsultationByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.consultationsService.getConsultationByAppointmentId(appointmentId);
  }

  @Put(':id')
  async updateConsultation(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ) {
    return this.consultationsService.updateConsultation(id, updateConsultationDto);
  }

  @Post(':id/start')
  async startConsultation(@Param('id') id: string) {
    return this.consultationsService.startConsultation(id);
  }

  @Post(':id/end')
  async endConsultation(
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.consultationsService.endConsultation(id, notes);
  }
}
