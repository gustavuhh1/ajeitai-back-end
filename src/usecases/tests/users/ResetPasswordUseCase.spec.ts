import { describe, it, expect, beforeEach, vi } from "vitest";
import { InMemoryUserRepository } from "@/repositories/in-memory/InMemoryUserRepository";
import { ResetPasswordUseCase } from "@/usecases/users/ResetPasswordUseCase";

describe("ResetPasswordUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let sut: ResetPasswordUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new ResetPasswordUseCase(userRepository);
  });

  it("should be able to call resetPassword repository method", async () => {
    const resetPasswordSpy = vi.spyOn(userRepository, "resetPassword");

    const body = { newPassword: "newpassword123", token: "valid-token" };

    await sut.execute(body);

    expect(resetPasswordSpy).toHaveBeenCalledWith(body);
  });
});
