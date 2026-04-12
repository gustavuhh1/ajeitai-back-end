import {Request, Response} from 'express'
import { GetServiceByIdUseCase } from '@/usecases/GetServiceByIdUseCase'
import { PrismaServiceRepository } from '@/repositories/PrismaServiceRepository'

export class GetServiceByIdController {

    async handle(request: Request, response: Response) {
        const {id} = request.params

        if(!id || typeof id !== 'string') {
            return response.status(400).json({
                message: "ID do serviço inválido ou não fornecido"
            })
        }

        try {

            const serviceRepository = new PrismaServiceRepository()
            const useCase = new GetServiceByIdUseCase(serviceRepository)

            const service = await useCase.execute(id)
            return response.status(200).json(service)
        } catch (error: any) {
            return response.status(404).json({message: error.message || "Erro na visualização do serviço"})
        }
    }
}