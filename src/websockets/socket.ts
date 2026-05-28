import { Server as HttpServer } from 'node:http';
import { Server, Socket } from 'socket.io';
import { sendMessageFactory } from '@/usecases/factories/sendMessageFactory';

let io: Server;

export function initSocket(server: HttpServer) {
  // Configuração do CORS do Socket.io
  io = new Server(server, {
    cors: {
      origin: "*", // No ambiente de produção, substitua pelo domínio do Front-end
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Novo cliente conectado via WebSocket: ${socket.id}`);

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
        // Usa a Factory existente para injetar dependências (Prisma) e instanciar o UseCase
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
        // Opcional: Avisar o cliente que enviou sobre o erro
        socket.emit('message_error', { error: 'Não foi possível enviar a mensagem' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
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
