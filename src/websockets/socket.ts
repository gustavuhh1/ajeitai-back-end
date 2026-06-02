import { Server as HttpServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { sendMessageFactory } from '@/usecases/factories/sendMessageFactory';
import { auth } from '@/auth/auth';
import { fromNodeHeaders } from 'better-auth/node';

let io: Server;

export function initSocket(server: HttpServer) {
  // Configuração do CORS do Socket.io
  io = new Server(server, {
    cors: {
      origin: "*", // No ambiente de produção, substitua pelo domínio do Front-end
      methods: ["GET", "POST"]
    }
  });

  // Middleware de Autenticação para as conexões Socket.IO
  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.request.headers)
      });
      if (!session) {
        return next(new Error('Authentication error: Você precisa estar logado'));
      }
      socket.data.user = session.user;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Erro interno na verificação'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    console.log(`Novo cliente conectado via WebSocket: ${socket.id} (User: ${user.id})`);

    // Entra na "sala pessoal" do usuário para receber notificações privadas
    socket.join(user.id);
    console.log(`Usuário ${user.id} ingressou na sua sala pessoal de notificações.`);

    // Cliente entra na sala do Orçamento
    socket.on('join_room', (budgetId: string) => {
      socket.join(budgetId);
      console.log(`Cliente ${socket.id} entrou na sala do orçamento: ${budgetId}`);
    });

    // Evento de "Digitando..."
    socket.on('typing', (data: { budgetId: string, userName: string }) => {
      // Envia para todos da sala (menos para quem enviou o evento)
      socket.to(data.budgetId).emit('user_typing', { userName: data.userName });
    });

    // Evento de "Parou de digitar..."
    socket.on('stop_typing', (data: { budgetId: string, userName: string }) => {
      socket.to(data.budgetId).emit('user_stopped_typing', { userName: data.userName });
    });

    // Evento de envio de mensagem
    socket.on('send_message', async (data: {
      budgetId: string;
      senderId: string;
      text?: string;
      imageUrl?: string;
    }) => {
      try {
        const sendMessageUseCase = sendMessageFactory();

        const message = await sendMessageUseCase.execute({
          budgetId: data.budgetId,
          senderId: data.senderId,
          text: data.text,
          imageUrl: data.imageUrl
        });

        // Dispara o evento 'new_message' para todos na sala, INCLUINDO quem enviou
        io.to(data.budgetId).emit('new_message', message);
      } catch (error) {
        console.error('Erro ao enviar mensagem pelo socket:', error);
        socket.emit('message_error', { error: 'Não foi possível enviar a mensagem' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id} (User: ${user.id})`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io não foi inicializado');
  }
  return io;
}

// Função utilitária para emitir notificação privada para um usuário
export function emitNotificationToUser(userId: string, payload: any) {
  if (io) {
    io.to(userId).emit('new_notification', payload);
  }
}

