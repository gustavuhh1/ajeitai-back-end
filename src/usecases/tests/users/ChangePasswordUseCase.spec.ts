import { describe, it, expect, beforeEach, vi } from "vitest";
import { InMemoryUserRepository } from "@/repositories/in-memory/InMemoryUserRepository";
import { ChangePasswordUseCase } from "@/usecases/users/ChangePasswordUseCase";

describe("ChangePasswordUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let sut: ChangePasswordUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new ChangePasswordUseCase(userRepository);
  });

  it("should be able to call changePassword repository method", async () => {
    const changePasswordSpy = vi.spyOn(userRepository, "changePassword");

    const headers = new Headers();
    const body = { currentPassword: "old", newPassword: "new", revokeOtherSessions: true };

    await sut.execute(headers, body);

    expect(changePasswordSpy).toHaveBeenCalledWith(headers, body);
  });
});
