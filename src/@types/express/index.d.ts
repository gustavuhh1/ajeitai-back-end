import { User } from "@/entities/User"; 

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                avatar_url?: string,
                email: string,
                name: string,
                cpf?: string,
                role?: string
            }
        }
    }
}