import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorProfileDto, UpdateDoctorProfileDto, SetAvailabilityDto } from './dto/doctors.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Get()
  async getAllDoctors(
    @Query('specialty') specialty?: string,
    @Query('verified') verified?: string,
  ) {
    const isVerified = verified === 'true' ? true : verified === 'false' ? false : undefined;
    return this.doctorsService.getAllDoctors(specialty, isVerified);
  }

  @Get(':id')
  async getDoctorProfile(@Param('id') id: string) {
    return this.doctorsService.getDoctorProfile(id);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  async createDoctorProfile(
    @Body() createDoctorDto: CreateDoctorProfileDto,
    @Body('userId') userId: string,
  ) {
    return this.doctorsService.createDoctorProfile(userId, createDoctorDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor', 'admin')
  async updateDoctorProfile(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorProfileDto,
  ) {
    return this.doctorsService.updateDoctorProfile(id, updateDoctorDto);
  }

  @Post(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  async setAvailability(
    @Param('id') id: string,
    @Body() availabilityDto: SetAvailabilityDto,
  ) {
    return this.doctorsService.setAvailability(id, availabilityDto);
  }

  @Get(':id/availability')
  async getAvailability(
    @Param('id') id: string,
    @Query('date') date?: string,
  ) {
    return this.doctorsService.getAvailability(id, date);
  }

  @Put(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async verifyDoctor(
    @Param('id') id: string,
    @Body('isVerified') isVerified: boolean,
  ) {
    return this.doctorsService.verifyDoctor(id, isVerified);
  }
}
