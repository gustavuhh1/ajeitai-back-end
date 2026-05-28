import { User } from "@/entities/User"; 

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                image?: string | null,
                email: string,
                name: string,
                cpf: string,
                role: string
            }
        }
    }
}
