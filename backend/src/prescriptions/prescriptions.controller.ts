import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/prescriptions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('doctor')
  async createPrescription(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
    @Body('doctorId') doctorId: string,
  ) {
    return this.prescriptionsService.createPrescription(doctorId, createPrescriptionDto);
  }

  @Get(':id')
  async getPrescription(@Param('id') id: string) {
    return this.prescriptionsService.getPrescriptionById(id);
  }

  @Get('patient/:patientId')
  @UseGuards(RolesGuard)
  @Roles('patient', 'admin')
  async getPatientPrescriptions(@Param('patientId') patientId: string) {
    return this.prescriptionsService.getPatientPrescriptions(patientId);
  }

  @Get('doctor/:doctorId')
  @UseGuards(RolesGuard)
  @Roles('doctor', 'admin')
  async getDoctorPrescriptions(@Param('doctorId') doctorId: string) {
    return this.prescriptionsService.getDoctorPrescriptions(doctorId);
  }
}
