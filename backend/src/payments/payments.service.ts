import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import Razorpay from 'razorpay';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payments.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const options = {
        amount: createOrderDto.amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${uuidv4()}`,
        notes: {
          appointment_id: createOrderDto.appointment_id,
          patient_id: createOrderDto.patient_id,
          doctor_id: createOrderDto.doctor_id,
        },
      };

      const order = await this.razorpay.orders.create(options);

      // Save order details in database
      const supabase = this.supabaseService.getClient();
      await supabase.from('payments').insert({
        id: uuidv4(),
        order_id: order.id,
        appointment_id: createOrderDto.appointment_id,
        patient_id: createOrderDto.patient_id,
        amount: createOrderDto.amount,
        currency: 'INR',
        status: 'pending',
      });

      return order;
    } catch (error) {
      throw new BadRequestException('Failed to create Razorpay order');
    }
  }

  async verifyPayment(verifyPaymentDto: VerifyPaymentDto) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentDto;

      // Verify signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET'))
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === razorpay_signature;

      if (!isValid) {
        throw new BadRequestException('Invalid payment signature');
      }

      // Update payment status in database
      const supabase = this.supabaseService.getClient();
      const { data, error } = await supabase
        .from('payments')
        .update({
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          status: 'completed',
        })
        .eq('order_id', razorpay_order_id)
        .select()
        .single();

      if (error) {
        throw new BadRequestException('Failed to update payment status');
      }

      return { success: true, payment: data };
    } catch (error) {
      throw new BadRequestException(error.message || 'Payment verification failed');
    }
  }

  async getPaymentByOrderId(orderId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !data) {
      throw new BadRequestException('Payment not found');
    }

    return data;
  }
}
