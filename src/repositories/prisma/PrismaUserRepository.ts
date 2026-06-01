import { prisma } from "@/utils/prisma";
import { User, UserRoles } from "@/entities/User";
import { auth } from "@/auth/auth";
import { IUserRepository } from "../IUserRepository";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { email },
    });

    if (!userData) {
      return null;
    }

    return new User({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      cpf: userData.cpf,
      phone: userData.phone,
      birthDate: userData.birthDate,
      description: userData.description,
      role: userData.role as UserRoles,
      avgRating: userData.avgRating,
      created_at: userData.createdAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { id },
    });

    if (!userData) {
      return null;
    }

    return new User({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      cpf: userData.cpf,
      phone: userData.phone,
      birthDate: userData.birthDate,
      description: userData.description,
      role: userData.role as UserRoles,
      avgRating: userData.avgRating,
      created_at: userData.createdAt,
    });
  }

  async updateProfile(id: string, data: Partial<User>): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        description: data.description,
        image: data.image,
        updatedAt: new Date(),
      },
    });
  }

  async save(user: User): Promise<void> {
    await auth.api.signUpEmail({
      body: {
        name: user.name,
        image: user.image ?? undefined,
        email: user.email,
        password: user.password as any,
        cpf: user.cpf,
        role: user.role as UserRoles,
        phone: user.phone ?? undefined,
        birthDate: user.birthDate ?? undefined,
        description: user.description ?? undefined,
      },
    });
  }

  async resetPassword(password: string, token: string): Promise<void> {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token: token,
      },
    });
  }
}
