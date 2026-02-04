import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateConsultationDto {
  @IsUUID()
  appointment_id: string;
}

export class UpdateConsultationDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  started_at?: string;

  @IsString()
  @IsOptional()
  ended_at?: string;
}
