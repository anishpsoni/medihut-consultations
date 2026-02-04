import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/auth.service';

interface ChatMessage {
  consultationId: string;
  senderId: string;
  message: string;
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private consultationRooms = new Map<string, Set<string>>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const user = await this.authService.verifyToken(token);
      if (!user) {
        client.disconnect();
        return;
      }

      client.data.user = user;
      console.log(`Client connected: ${client.id}, User: ${user.id}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    
    // Remove client from all consultation rooms
    this.consultationRooms.forEach((clients, consultationId) => {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.consultationRooms.delete(consultationId);
        }
      }
    });
  }

  @SubscribeMessage('joinConsultation')
  async handleJoinConsultation(
    @MessageBody() data: { consultationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { consultationId } = data;
    
    client.join(consultationId);
    
    if (!this.consultationRooms.has(consultationId)) {
      this.consultationRooms.set(consultationId, new Set());
    }
    this.consultationRooms.get(consultationId).add(client.id);

    // Load previous messages
    const messages = await this.chatService.getMessages(consultationId);
    client.emit('previousMessages', messages);

    console.log(`Client ${client.id} joined consultation ${consultationId}`);
  }

  @SubscribeMessage('leaveConsultation')
  handleLeaveConsultation(
    @MessageBody() data: { consultationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { consultationId } = data;
    client.leave(consultationId);
    
    const room = this.consultationRooms.get(consultationId);
    if (room) {
      room.delete(client.id);
      if (room.size === 0) {
        this.consultationRooms.delete(consultationId);
      }
    }

    console.log(`Client ${client.id} left consultation ${consultationId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { consultationId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { consultationId, message } = data;
    const user = client.data.user;

    if (!user) {
      return;
    }

    // Save message to database
    const savedMessage = await this.chatService.saveMessage(
      consultationId,
      user.id,
      message,
    );

    // Broadcast message to all clients in the consultation room
    const chatMessage: ChatMessage = {
      consultationId,
      senderId: user.id,
      message,
      timestamp: new Date().toISOString(),
    };

    this.server.to(consultationId).emit('newMessage', chatMessage);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { consultationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const { consultationId, isTyping } = data;
    const user = client.data.user;

    if (!user) {
      return;
    }

    client.to(consultationId).emit('userTyping', {
      userId: user.id,
      isTyping,
    });
  }
}
