import { Message } from "@/entities/Message";
import { IMessageRepository } from "@/repositories/IMessageRepository";
import { IBudgetRepository } from "@/repositories/IBudgetRepository";
import { IServiceRepository } from "@/repositories/IServiceRepository";
import { INotificationService } from "@/services/INotificationService";

interface SendMessageRequest {
  text?: string;
  imageUrl?: string;
  senderId: string;
  budgetId: string;
}

export class SendMessageUseCase {
  constructor(
    private messageRepository: IMessageRepository,
    private budgetRepository: IBudgetRepository,
    private serviceRepository: IServiceRepository,
    private notificationService: INotificationService
  ) {}

  async execute(data: SendMessageRequest) {
    if (!data.text && !data.imageUrl) {
      throw new Error("A mensagem deve conter texto ou imagem");
    }

    const budget = await this.budgetRepository.findById(data.budgetId);
    if (!budget) {
      throw new Error("Orçamento não encontrado");
    }

    const service = await this.serviceRepository.findById(budget.serviceId);
    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    const message = new Message({
      text: data.text ?? null,
      imageUrl: data.imageUrl ?? null,
      senderId: data.senderId,
      budgetId: data.budgetId,
    });

    await this.messageRepository.create(message);

    // Identifica o receptor da notificação
    const isSenderClient = data.senderId === service.client_id;
    const receiverId = isSenderClient ? budget.providerId : service.client_id;

    // Dispara a notificação para a outra parte
    await this.notificationService.dispatch(receiverId, {
      title: "Nova Mensagem",
      message: `Você tem uma nova mensagem no serviço "${service.title}"`,
      type: "NEW_MESSAGE",
      link: `/chat/${budget.id}` // Exemplo de link
    });

    return message;
  }
}
