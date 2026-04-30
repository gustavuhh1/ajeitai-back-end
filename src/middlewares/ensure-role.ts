import { Request, Response, NextFunction } from "express";

export function ensureRole(role: 'CLIENT' | 'PROVIDER' | 'ADMIN') {
    return (request: Request, response: Response, next: NextFunction) => {
        const user = request.user

        if(!user || user.role !== role) {
            return response.status(403).json({
                message: 'Acesso negado. Esta rota é exclusiva para ' + role
            })
        }

        return next
    }
}