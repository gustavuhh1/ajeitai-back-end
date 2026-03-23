import {Router} from 'express'
import {CreateUserController} from '@/controllers/CreateUserController'
import { CreateServiceController } from '@/controllers/CreateServiceController'
import {SignInController} from '@/controllers/SignInController'
import {GetProfileController} from "@/controllers/GetProfileController"
import { authMiddleware } from '@/middlewares/auth-middleware'

export const router = Router()

const createUserController = new CreateUserController()
const createServiceController = new CreateServiceController()
const signInController = new SignInController()
const getProfileController = new GetProfileController()

router.post('/users', createUserController.handle)
router.post('/sessions', signInController.handle)

router.post('/services', authMiddleware, createServiceController.handle)

router.get('/me', authMiddleware, getProfileController.handle)

