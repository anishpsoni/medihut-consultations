import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsString()
  specialty: string;

  @IsString()
  qualification: string;

  @IsNumber()
  experience_years: number;

  @IsString()
  @IsOptional()
  registration_number?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  consultation_fee: number;

  @IsArray()
  @IsOptional()
  languages?: string[];
}

export class UpdateDoctorProfileDto {
  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @IsOptional()
  qualification?: string;

  @IsNumber()
  @IsOptional()
  experience_years?: number;

  @IsString()
  @IsOptional()
  registration_number?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  consultation_fee?: number;

  @IsArray()
  @IsOptional()
  languages?: string[];
}

export class SetAvailabilityDto {
  @IsString()
  date: string;

  @IsArray()
  time_slots: string[];

  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}
