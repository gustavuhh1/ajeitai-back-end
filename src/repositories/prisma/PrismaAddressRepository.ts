import { prisma } from "@/utils/prisma";
import { Address } from "../../entities/Address";
import { IAddressRepository } from "../IAddressRepository";

export class PrismaAddressRepository implements IAddressRepository {
  async create(address: Address): Promise<void> {
    await prisma.address.create({
      data: {
        id: address.id,
        rua: address.rua,
        numero: address.numero,
        ponto_de_referencia: address.ponto_de_referencia,
        cep: address.cep,
        complemento: address.complemento,
        cidade: address.cidade,
        estado: address.estado,
        latitude: address.latitude,
        longitude: address.longitude,
        principal: address.principal,
        user_id: address.user_id,
      },
    });
  }

  async findByUserId(userId: string): Promise<Address[]> {
    const data = await prisma.address.findMany({
      where: { user_id: userId },
      orderBy: { principal: "desc" },
    });

    return data.map(
      (address) =>
        new Address(
          {
            rua: address.rua,
            numero: address.numero,
            ponto_de_referencia: address.ponto_de_referencia,
            cep: address.cep,
            complemento: address.complemento,
            cidade: address.cidade,
            estado: address.estado,
            latitude: address.latitude,
            longitude: address.longitude,
            principal: address.principal,
            user_id: address.user_id,
          },
          address.id,
        ),
    );
  }

  async findById(id: string): Promise<Address | null> {
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) return null;

    return new Address(
      {
        rua: address.rua,
        numero: address.numero,
        ponto_de_referencia: address.ponto_de_referencia,
        cep: address.cep,
        complemento: address.complemento,
        cidade: address.cidade,
        estado: address.estado,
        latitude: address.latitude,
        longitude: address.longitude,
        principal: address.principal,
        user_id: address.user_id,
      },
      address.id,
    );
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.address.count({
      where: { user_id: userId },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.address.delete({
      where: { id },
    });
  }

  async togglePrincipal(addressId: string, userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { user_id: userId, principal: true, NOT: { id: addressId } },
        data: { principal: false },
      }),
      prisma.address.update({
        where: { id: addressId, user_id: userId },
        data: { principal: true },
      }),
    ]);
  }
}
