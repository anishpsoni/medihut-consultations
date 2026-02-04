import { IsUUID, IsString, IsArray, IsOptional } from 'class-validator';

export class MedicationDto {
  @IsString()
  name: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsString()
  duration: string;
}

export class CreatePrescriptionDto {
  @IsUUID()
  consultation_id: string;

  @IsUUID()
  patient_id: string;

  @IsArray()
  medications: MedicationDto[];

  @IsString()
  diagnosis: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
