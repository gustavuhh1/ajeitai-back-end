import {Router} from 'express'
import {CreateUserController} from '@/controllers/CreateUserController'

export const router = Router()

const createUserController = new CreateUserController()

router.post('/users', createUserController.handle)

