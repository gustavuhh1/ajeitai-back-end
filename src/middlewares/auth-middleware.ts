import {Request, Response, NextFunction} from 'express'
import { auth } from '@/auth/auth'
import {fromNodeHeaders} from 'better-auth/node'

export async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers)
    })

    if(!session) {
        return response.status(401).json({message: "Você precisa estar logado"})
    }

    request.user = session.user

    return next()
}