import { IsUUID, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  appointment_id: string;

  @IsUUID()
  patient_id: string;

  @IsUUID()
  doctor_id: string;

  @IsNumber()
  amount: number;
}

export class VerifyPaymentDto {
  @IsString()
  razorpay_order_id: string;

  @IsString()
  razorpay_payment_id: string;

  @IsString()
  razorpay_signature: string;
}
