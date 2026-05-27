import { betterAuth } from "better-auth"
import {prismaAdapter} from "better-auth/adapters/prisma"
import {prisma} from "@/utils/prisma"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
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
            age: {
                type: "number",
                required: false,
            },
            description: {
                type: "string",
                required: false,
            }
        }
    }
})
