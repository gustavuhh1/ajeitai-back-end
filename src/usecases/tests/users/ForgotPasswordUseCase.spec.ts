import { describe, it, expect, beforeEach, vi } from "vitest";
import { InMemoryUserRepository } from "@/repositories/in-memory/InMemoryUserRepository";
import { ForgotPasswordUseCase } from "@/usecases/users/ForgotPasswordUseCase";

describe("ForgotPasswordUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let sut: ForgotPasswordUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new ForgotPasswordUseCase(userRepository);
  });

  it("should be able to call forgetPassword repository method", async () => {
    const forgetPasswordSpy = vi.spyOn(userRepository, "forgetPassword");

    const body = { email: "test@example.com", redirectTo: "http://localhost:3000/reset-password" };

    await sut.execute(body);

    expect(forgetPasswordSpy).toHaveBeenCalledWith(body);
  });
});
