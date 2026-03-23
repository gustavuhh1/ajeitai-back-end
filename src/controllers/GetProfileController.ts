import {Request, Response} from 'express'

export class GetProfileController {
    async handle (request: Request, response: Response) {
        try {
            const user = request.user

            if(!user) {
                return response.status(401).json({message: "Usuário não encontrado na sessão"})
            }

            return response.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    cpf: user.cpf,
                    role: user.role
                }
            })

        } catch (error) {
            return response.status(500).json({error: "Erro interno ao buscar perfil"})
        }
    }
}