import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/utils/prisma";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }) => {
      await resend.emails.send({
        from: "Ajeitai <onboarding@resend.dev>",
        to: "delivered@resend.dev", // utiliando email de teste, pois não possuimos dominio próprio
        subject: "Redefinição de senha - Ajeitai",
        text: `Você solicitou a redefinição de sua senha. Clique no link para redefinir: ${url} ou insira o token: ${token}`,
      });
    },
  },
  user: {
    additionalFields: {
      cpf: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        defaultValue: "CLIENT",
      },
      phone: {
        type: "string",
        required: false,
      },
      birthDate: {
        type: "date",
        required: false,
      },
      description: {
        type: "string",
        required: false,
      },
    },
  },
});
