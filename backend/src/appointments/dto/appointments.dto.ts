import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../appointments.service';

export class CreateAppointmentDto {
  @IsUUID()
  doctor_id: string;

  @IsString()
  appointment_date: string;

  @IsString()
  time_slot: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
