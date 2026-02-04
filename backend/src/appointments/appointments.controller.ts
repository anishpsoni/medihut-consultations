import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('patient')
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Body('patientId') patientId: string,
  ) {
    return this.appointmentsService.createAppointment(patientId, createAppointmentDto);
  }

  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Get('patient/:patientId')
  @UseGuards(RolesGuard)
  @Roles('patient', 'admin')
  async getPatientAppointments(
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
  ) {
    return this.appointmentsService.getPatientAppointments(patientId, status);
  }

  @Get('doctor/:doctorId')
  @UseGuards(RolesGuard)
  @Roles('doctor', 'admin')
  async getDoctorAppointments(
    @Param('doctorId') doctorId: string,
    @Query('status') status?: string,
  ) {
    return this.appointmentsService.getDoctorAppointments(doctorId, status);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('doctor', 'admin')
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateAppointmentStatus(id, updateStatusDto);
  }

  @Put(':id/cancel')
  async cancelAppointment(@Param('id') id: string) {
    return this.appointmentsService.cancelAppointment(id);
  }
}
