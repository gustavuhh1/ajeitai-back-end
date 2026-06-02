import { describe, it, expect, beforeEach } from "vitest";
import { ListNotificationsUseCase } from "../../notifications/ListNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "../../notifications/MarkNotificationAsReadUseCase";
import { MarkAllNotificationsAsReadUseCase } from "../../notifications/MarkAllNotificationsAsReadUseCase";
import { InMemoryNotificationRepository } from "../../../repositories/in-memory/InMemoryNotificationRepository";
import { Notification } from "../../../entities/Notification";

describe("Notifications UseCases", () => {
  let repository: InMemoryNotificationRepository;
  let listSut: ListNotificationsUseCase;
  let markSut: MarkNotificationAsReadUseCase;
  let markAllSut: MarkAllNotificationsAsReadUseCase;

  beforeEach(() => {
    repository = new InMemoryNotificationRepository();
    listSut = new ListNotificationsUseCase(repository);
    markSut = new MarkNotificationAsReadUseCase(repository);
    markAllSut = new MarkAllNotificationsAsReadUseCase(repository);
  });

  it("deve listar as notificações de um usuário", async () => {
    repository.items.push(
      new Notification({ userId: "user-1", title: "Test 1", message: "Msg 1", type: "NEW_MESSAGE" }),
      new Notification({ userId: "user-1", title: "Test 2", message: "Msg 2", type: "NEW_QUOTE" }),
      new Notification({ userId: "user-2", title: "Test 3", message: "Msg 3", type: "NEW_MESSAGE" })
    );

    const notifications = await listSut.execute({ userId: "user-1" });
    expect(notifications).toHaveLength(2);
    expect(notifications[0]!.title).toBe("Test 1");
  });

  it("deve marcar uma notificação como lida", async () => {
    const notification = new Notification({ userId: "user-1", title: "Test 1", message: "Msg 1", type: "NEW_MESSAGE" });
    repository.items.push(notification);

    await markSut.execute({ notificationId: notification.id as string, userId: "user-1" });

    expect(repository.items[0]!.isRead).toBe(true);
  });

  it("deve lançar erro ao tentar marcar notificação de outro usuário", async () => {
    const notification = new Notification({ userId: "user-1", title: "Test 1", message: "Msg 1", type: "NEW_MESSAGE" });
    repository.items.push(notification);

    await expect(
      markSut.execute({ notificationId: notification.id as string, userId: "user-2" })
    ).rejects.toThrow("Não autorizado");
  });

  it("deve marcar todas as notificações do usuário como lidas", async () => {
    repository.items.push(
      new Notification({ userId: "user-1", title: "Test 1", message: "Msg 1", type: "NEW_MESSAGE", isRead: false }),
      new Notification({ userId: "user-1", title: "Test 2", message: "Msg 2", type: "NEW_QUOTE", isRead: false }),
      new Notification({ userId: "user-2", title: "Test 3", message: "Msg 3", type: "NEW_MESSAGE", isRead: false })
    );

    await markAllSut.execute({ userId: "user-1" });

    expect(repository.items[0]!.isRead).toBe(true);
    expect(repository.items[1]!.isRead).toBe(true);
    expect(repository.items[2]!.isRead).toBe(false); // Do outro user continua false
  });
});
