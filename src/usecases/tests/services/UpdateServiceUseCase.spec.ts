import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryServiceRepository } from "@/repositories/in-memory/InMemoryServiceRepository";
import { UpdateServiceUseCase } from "@/usecases/services/UpdateServiceUseCase";
import { Service } from "@/entities/Service";

describe("UpdateServiceUseCase", () => {
  let serviceRepository: InMemoryServiceRepository;
  let sut: UpdateServiceUseCase;

  beforeEach(() => {
    serviceRepository = new InMemoryServiceRepository();
    sut = new UpdateServiceUseCase(serviceRepository);
  });

  it("should be able to update a service", async () => {
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
      title: "Conserto de Geladeira Brastemp",
      description: "Nova descrição detalhada. " + "x".repeat(100),
    });

    const updatedService = await serviceRepository.findById("service-1");
    expect(updatedService?.title).toBe("Conserto de Geladeira Brastemp");
    expect(updatedService?.description).toContain("Nova descrição detalhada.");
  });

  it("should not be able to update a service that does not exist", async () => {
    await expect(
      sut.execute({
        userId: "user-1",
        serviceId: "invalid-service-id",
        title: "Conserto de Geladeira Brastemp",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to update a service if user is not the owner", async () => {
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
        title: "Conserto de Geladeira Brastemp",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to update a service if status is not ABERTO", async () => {
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
        title: "Conserto de Geladeira Brastemp",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to update a service with less than 1 image", async () => {
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
        userId: "user-1",
        serviceId: "service-1",
        images_url: [], // empty array
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to update a service with description less than 100 chars", async () => {
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
        userId: "user-1",
        serviceId: "service-1",
        description: "Curta descrição", // less than 100 chars
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
