import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { auth } from "../src/auth/auth";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

console.log(process.env.DATABASE_URL);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando a seed de categorias");

  const categories = [
    { name: "Limpeza", icon: "broom" },
    { name: "Elétrica", icon: "zap" },
    { name: "Encanamento", icon: "droplet" },
    { name: "Pintura", icon: "paint-roller" },
    { name: "Mecânica", icon: "wrench" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("Criando usuários via Better-Auth (2 Clientes, 2 Prestadores)...");

  // Helper para criar ou buscar usuário
  async function getOrCreateUser(userData: any) {
    let user = await prisma.user.findUnique({ where: { email: userData.email } });
    if (!user) {
      const result = await auth.api.signUpEmail({
        body: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          cpf: userData.cpf,
          role: userData.role,
        },
      });
      user = result.user as any;
    }
    return user;
  }

  const client1Data = {
    name: "Cliente Um",
    email: "cliente1@teste.com",
    password: "123123123",
    cpf: "11111111111",
    role: "CLIENT",
  };
  const client1 = await getOrCreateUser(client1Data);

  // Verifica se já tem endereço, se não cria
  const client1Addresses = await prisma.address.findMany({
    where: { user_id: client1!.id },
  });
  if (client1Addresses.length === 0) {
    await prisma.address.create({
      data: {
        rua: "Rua A",
        numero: "123",
        cep: "12345678",
        cidade: "São Paulo",
        estado: "SP",
        latitude: -23.55052,
        longitude: -46.633308,
        principal: true,
        user_id: client1!.id,
      },
    });
  }

  const client2Data = {
    name: "Cliente Dois",
    email: "cliente2@teste.com",
    password: "123123123",
    cpf: "22222222222",
    role: "CLIENT",
  };
  const client2 = await getOrCreateUser(client2Data);

  const provider1Data = {
    name: "Prestador Um",
    email: "prestador1@teste.com",
    password: "123123123",
    cpf: "33333333333",
    role: "PROVIDER",
  };
  const provider1 = await getOrCreateUser(provider1Data);

  const provider2Data = {
    name: "Prestador Dois",
    email: "prestador2@teste.com",
    password: "123123123",
    cpf: "44444444444",
    role: "PROVIDER",
  };
  const provider2 = await getOrCreateUser(provider2Data);

  console.log("Criando serviço para o Cliente 1...");

  // Pega uma categoria para o serviço
  const categoriaLimpeza = await prisma.category.findUnique({
    where: { name: "Limpeza" },
  });

  // Precisamos buscar ou criar o serviço
  let service = await prisma.service.findFirst({
    where: { client_id: client1!.id, title: "Limpeza geral na casa" },
  });

  const c1Address = await prisma.address.findFirst({ where: { user_id: client1!.id } });

  if (!service && c1Address) {
    service = await prisma.service.create({
      data: {
        title: "Limpeza geral na casa",
        description: "Preciso de uma limpeza completa, incluindo janelas.",
        status: "ABERTO",
        client_id: client1!.id,
        address_id: c1Address.id,
        categories: {
          connect: { id: categoriaLimpeza?.id },
        },
      },
    });
  }

  if (service) {
    console.log("Criando orçamentos dos 2 prestadores para o serviço...");

    // Orçamento do Prestador 1
    const budget1 = await prisma.budget.findFirst({
      where: { serviceId: service.id, providerId: provider1!.id },
    });

    if (!budget1) {
      await prisma.budget.create({
        data: {
          price: 150.0,
          description: "Posso fazer o serviço amanhã pela manhã.",
          estimatedDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Amanhã
          status: "AGUARDANDO_CLIENTE",
          serviceId: service.id,
          providerId: provider1!.id,
        },
      });
    }

    // Orçamento do Prestador 2
    const budget2 = await prisma.budget.findFirst({
      where: { serviceId: service.id, providerId: provider2!.id },
    });

    if (!budget2) {
      await prisma.budget.create({
        data: {
          price: 120.0,
          description: "Faço hoje mesmo a tarde!",
          estimatedDate: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), // Daqui a 5 horas
          status: "AGUARDANDO_CLIENTE",
          serviceId: service.id,
          providerId: provider2!.id,
        },
      });
    }
  }
}

main()
  .then(async () => {
    console.log("Seed completado com sucesso!");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
  });
