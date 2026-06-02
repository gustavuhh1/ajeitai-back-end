import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryServiceRepository } from "@/repositories/in-memory/InMemoryServiceRepository";
import { InMemoryBudgetRepository } from "@/repositories/in-memory/InMemoryBudgetRepository";
import { DeleteServiceUseCase } from "@/usecases/services/DeleteServiceUseCase";
import { Service } from "@/entities/Service";

describe("DeleteServiceUseCase", () => {
  let serviceRepository: InMemoryServiceRepository;
  let budgetRepository: InMemoryBudgetRepository;
  let notificationServiceMock: any;
  let sut: DeleteServiceUseCase;

  beforeEach(() => {
    serviceRepository = new InMemoryServiceRepository();
    budgetRepository = new InMemoryBudgetRepository();
    notificationServiceMock = { dispatch: async () => {} };
    sut = new DeleteServiceUseCase(
      serviceRepository,
      budgetRepository,
      notificationServiceMock
    );
  });

  it("should be able to delete a service", async () => {
    const service = new Service({
      id: "service-1",
      title: "Conserto de Geladeira",
      description: "Geladeira não gela. " + "x".repeat(100),
      images_url: ["img1.png"],
      address_id: "address-1",
      categoryIds: ["cat-1"],
      client_id: "user-1",
      status: "ABERTO",
    });

    await serviceRepository.create(service);

    await sut.execute({
      userId: "user-1",
      serviceId: "service-1",
    });

    const deletedService = await serviceRepository.findById("service-1");
    expect(deletedService).toBeNull();
  });

  it("should not be able to delete a service that does not exist", async () => {
    await expect(
      sut.execute({
        userId: "user-1",
        serviceId: "invalid-service-id",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to delete a service if user is not the owner", async () => {
    const service = new Service({
      id: "service-1",
      title: "Conserto de Geladeira",
      description: "Geladeira não gela. " + "x".repeat(100),
      images_url: ["img1.png"],
      address_id: "address-1",
      categoryIds: ["cat-1"],
      client_id: "user-1",
      status: "ABERTO",
    });

    await serviceRepository.create(service);

    await expect(
      sut.execute({
        userId: "user-2", // different user
        serviceId: "service-1",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to delete a service if status is not ABERTO", async () => {
    const service = new Service({
      id: "service-1",
      title: "Conserto de Geladeira",
      description: "Geladeira não gela. " + "x".repeat(100),
      images_url: ["img1.png"],
      address_id: "address-1",
      categoryIds: ["cat-1"],
      client_id: "user-1",
      status: "EM_ANDAMENTO",
    });

    await serviceRepository.create(service);

    await expect(
      sut.execute({
        userId: "user-1",
        serviceId: "service-1",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
