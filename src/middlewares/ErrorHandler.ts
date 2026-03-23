import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const ErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        const message = err.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)

        return res.status(400).json({
            message: message,
            code: 'VALIDATION_ERROR',
            status: 400,
        })
    }

    console.error(err)

    return res.status(500).json({
        message: 'Internal server error',
        status: 500,
    })
}
