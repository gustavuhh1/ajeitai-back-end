import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUserRepository } from "@/repositories/in-memory/InMemoryUserRepository";
import { UpdateUserProfileUseCase } from "@/usecases/users/UpdateUserProfileUseCase";
import { User } from "@/entities/User";

describe("UpdateUserProfileUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let sut: UpdateUserProfileUseCase;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    sut = new UpdateUserProfileUseCase(userRepository);

    // Seed um usuário para os testes
    const user = new User({
      id: "user-1",
      name: "Nome Antigo",
      email: "test@example.com",
      cpf: "11122233344",
      phone: "11999999999",
      description: "Descrição Antiga",
      image: "image-antiga.png",
      role: "CLIENT",
    });

    await userRepository.save(user);
  });

  it("should be able to update user profile fully", async () => {
    await sut.execute({
      userId: "user-1",
      name: "Nome Novo",
      phone: "11888888888",
      description: "Descrição Nova",
      image: "image-nova.png",
    });

    const user = await userRepository.findById("user-1");

    expect(user?.name).toBe("Nome Novo");
    expect(user?.phone).toBe("11888888888");
    expect(user?.description).toBe("Descrição Nova");
    expect(user?.image).toBe("image-nova.png");
  });

  it("should be able to update user profile partially", async () => {
    await sut.execute({
      userId: "user-1",
      name: "Nome Parcial",
      // phone, description e image omitidos
    });

    const user = await userRepository.findById("user-1");

    expect(user?.name).toBe("Nome Parcial");
    expect(user?.phone).toBe("11999999999"); // Mantido
    expect(user?.description).toBe("Descrição Antiga"); // Mantido
  });

  it("should throw an error if user does not exist", async () => {
    await expect(
      sut.execute({
        userId: "user-inexistente",
        name: "Nome Novo",
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
