import { prisma } from "@/utils/prisma";
import { Service } from "@/entities/Service";
import {
  IServiceRepository,
  ListServicesFilters,
  ListServicesResponse,
  ServiceWithDetails,
  ServiceWithCategories,
} from "../IServiceRepository";

export class PrismaServiceRepository implements IServiceRepository {
  async create(service: Service) {
    await prisma.service.create({
      data: {
        id: service.id,
        title: service.title,
        description: service.description,
        categories: {
          connect: service.categoryIds.map(id => ({ id }))
        },
        client_id: service.client_id,
        status: service.status,
        address_id: service.address_id,
      },
    });
  }

  async findById(id: string) {
    const serviceData = await prisma.service.findUnique({
      where: { id },
      include: { categories: true }
    });

    if (!serviceData) return null;

    return new Service({
      id: serviceData.id,
      title: serviceData.title,
      images_url: serviceData.images_url as string[] ?? [],
      description: serviceData.description,
      categoryIds: serviceData.categories.map(c => c.id),
      client_id: serviceData.client_id,
      provider_id: serviceData.provider_id,
      start_date: serviceData.start_date,
      end_date: serviceData.end_date,
      status: serviceData.status as any,
      address_id: serviceData.address_id,
    });
  }

  // Faz um select no banco de dados e retorna todos os serviços disponiveis
  async findAllAvailable({
    categoryId,
    city,
    page,
    limit,
  }: ListServicesFilters): Promise<ListServicesResponse> {
    const skip = (page - 1) * limit;

    const where = {
      status: "ABERTO" as any,
      categories: categoryId ? { some: { id: categoryId } } : undefined,
      address: city ? { cidade: { contains: city, mode: "insensitive" as any } } : undefined,
    };

    const [serviceData, total] = await prisma.$transaction([
      prisma.service.findMany({
        where,
        take: limit,
        skip,
        orderBy: { id: "desc" },
        include: { categories: true },
      }),
      prisma.service.count({ where }),
    ]);

    const items = serviceData.map(
      (data) =>
        new Service({
          id: data.id,
          title: data.title,
          images_url: data.images_url,
          description: data.description,
          status: data.status as any,
          categoryIds: data.categories.map((c: any) => c.id),
          client_id: data.client_id,
          address_id: data.address_id,
        }),
    );

    return { items, total };
  }

  // Faz um select no banco de dados e retorna todos os serviços criados por um usuário
  async findAllByUser(userId: string): Promise<ServiceWithCategories[]> {
    const serviceData = await prisma.service.findMany({
      where: { client_id: userId },
      orderBy: { updatedAt: "desc" },
      include: { categories: true },
    });

    return serviceData.map((data) => {
      const service = new Service({
        id: data.id,
        title: data.title,
        images_url: data.images_url,
        description: data.description,
        status: data.status as any,
        categoryIds: data.categories.map((c: any) => c.id),
        client_id: data.client_id,
        address_id: data.address_id,
        provider_id: data.provider_id,
        start_date: data.start_date,
        end_date: data.end_date,
      });

      return Object.assign(service, {
        categories: data.categories.map((c: any) => ({
          id: c.id,
          name: c.name,
        })),
      }) as ServiceWithCategories;
    });
  }

  // faz um select no banco de dados e retorna todos os detalhes do serviço
  async findByIdWithDetails(id: string): Promise<ServiceWithDetails | null> {
    const serviceData = await prisma.service.findUnique({
      where: { id },
      include: {
        categories: true,
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        budgets: true,
        address: true,
      },
    });

    if (!serviceData) return null;

    const service = new Service({
      id: serviceData.id,
      title: serviceData.title,
      images_url: serviceData.images_url,
      description: serviceData.description,
      categoryIds: serviceData.categories.map(c => c.id),
      client_id: serviceData.client_id,
      provider_id: serviceData.provider_id,
      status: serviceData.status as any,
      address_id: serviceData.address_id,
    });

    return {
      ...service,
      budgetCount: serviceData.budgets ? serviceData.budgets.length : 0,
      address: {
        rua: serviceData.address.rua,
        numero: serviceData.address.numero,
        cidade: serviceData.address.cidade,
        estado: serviceData.address.estado,
        latitude: serviceData.address.latitude,
        longitude: serviceData.address.longitude,
      }
    } as ServiceWithDetails;
  }

  async countByAddressId(addressId: string): Promise<number> {
    return prisma.service.count({
      where: { address_id: addressId },
    });
  }

  async update(id: string, data: Partial<Service>): Promise<void> {
    await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        images_url: data.images_url ?? undefined,
        address_id: data.address_id,
        updatedAt: new Date(),
      },
    });
  }
}

