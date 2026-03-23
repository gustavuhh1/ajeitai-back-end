import {Request, Response} from 'express'
import {z, ZodError} from 'zod'
import {auth} from '@/auth/auth'

const signInSchema = z.object({
    email: z.string().email({message: "Formato de email inválido"}),
    password: z.string().min(1, {message: "A senha é obrigatória"})
})

export class SignInController {
    async handle (request: Request, response: Response) {
        try {
            const {email, password} = signInSchema.parse(request.body)

            const authResponse = await auth.api.signInEmail({
                body: {
                    email,
                    password
                },
                asResponse: true
            })

            authResponse.headers.forEach((value, key) => {
                response.setHeader(key, value)
            })

            const data = await authResponse.json()

            return response.status(authResponse.status).json(data)

        } catch (error) {
            if(error instanceof ZodError) {
                return response.status(400).json({
                    message: "Erro de validação",
                    issues: error.format()
                })
            }

            return response.status(401).json({
                error: "E-mail ou senha inválidos"
            })
        }
    }
}