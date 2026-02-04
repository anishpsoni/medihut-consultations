import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(private supabaseService: SupabaseService) {}

  async saveMessage(consultationId: string, senderId: string, message: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        id: uuidv4(),
        consultation_id: consultationId,
        sender_id: senderId,
        message: message,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Failed to save message');
    }

    return data;
  }

  async getMessages(consultationId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey(*)
      `)
      .eq('consultation_id', consultationId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch messages');
    }

    return data;
  }
}
