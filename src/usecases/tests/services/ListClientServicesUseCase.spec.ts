import { describe, it, expect, beforeEach } from "vitest";
import { ListClientServicesUseCase } from "../../services/ListClientServicesUseCase";
import { InMemoryServiceRepository } from "@/repositories/in-memory/InMemoryServiceRepository";
import { Service } from "@/entities/Service";

describe("List Client Services UseCase", () => {
  let serviceRepository: InMemoryServiceRepository;
  let sut: ListClientServicesUseCase;

  beforeEach(() => {
    serviceRepository = new InMemoryServiceRepository();
    sut = new ListClientServicesUseCase(serviceRepository);
  });

  it("should return all services created by the given user", async () => {
    const service1 = new Service({
      id: "service-1",
      title: "Service 1",
      description: "Description 1",
      categoryIds: ["cat-1"],
      client_id: "user-1",
      address_id: "address-1",
      status: "ABERTO",
      images_url: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service2 = new Service({
      id: "service-2",
      title: "Service 2",
      description: "Description 2",
      categoryIds: ["cat-1"],
      client_id: "user-2",
      address_id: "address-2",
      status: "ABERTO",
      images_url: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const service3 = new Service({
      id: "service-3",
      title: "Service 3",
      description: "Description 3",
      categoryIds: ["cat-1"],
      client_id: "user-1",
      address_id: "address-1",
      status: "FINALIZADO",
      images_url: [],
      createdAt: new Date(),
      updatedAt: new Date(Date.now() + 1000), // Mais recente
    });

    await serviceRepository.create(service1);
    await serviceRepository.create(service2);
    await serviceRepository.create(service3);

    const services = await sut.execute({ userId: "user-1" });

    expect(services).toHaveLength(2);
    // Deve retornar ordenado por updatedAt descendente
    expect(services[0]!.id).toBe("service-3");
    expect(services[1]!.id).toBe("service-1");
  });

  it("should return an empty array if user has no services", async () => {
    const services = await sut.execute({ userId: "user-without-services" });

    expect(services).toHaveLength(0);
    expect(services).toEqual([]);
  });

  it("should throw an error if no user ID is provided", async () => {
    await expect(sut.execute({ userId: "" })).rejects.toThrow("ID do usuário é obrigatório.");
  });
});
