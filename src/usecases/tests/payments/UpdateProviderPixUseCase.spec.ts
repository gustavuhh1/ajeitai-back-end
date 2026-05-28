import { describe, it, expect, beforeEach } from "vitest";
import { UpdateProviderPixUseCase } from "../../payments/UpdateProviderPixUseCase";
import { InMemoryUserRepository } from "../../../repositories/in-memory/InMemoryUserRepository";
import { User } from "../../../entities/User";

describe("UpdateProviderPixUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let sut: UpdateProviderPixUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new UpdateProviderPixUseCase(userRepository);
  });

  it("deve permitir que um prestador configure sua chave PIX", async () => {
    const provider = new User({
      name: "João Prestador",
      email: "joao@email.com",
      cpf: "12345678901",
      role: "PROVIDER"
    });

    await userRepository.save(provider);

    await sut.execute({
      providerId: provider.id!,
      pixKey: "meupix@email.com"
    });

    const updatedUser = await userRepository.findById(provider.id!);
    expect(updatedUser?.pixKey).toBe("meupix@email.com");
  });

  it("não deve permitir que um cliente configure uma chave PIX", async () => {
    const client = new User({
      name: "Maria Cliente",
      email: "maria@email.com",
      cpf: "98765432101",
      role: "CLIENT"
    });

    await userRepository.save(client);

    await expect(sut.execute({
      providerId: client.id!,
      pixKey: "meupix@email.com"
    })).rejects.toThrow("Apenas prestadores podem configurar uma chave PIX.");
  });

  it("deve lançar erro se o usuário não existir", async () => {
    await expect(sut.execute({
      providerId: "invalid-id",
      pixKey: "meupix@email.com"
    })).rejects.toThrow("Usuário não encontrado.");
  });
});
