import {Router} from 'express'
import {CreateUserController} from '@/controllers/CreateUserController'
import {SignInController} from '@/controllers/SignInController'
import {GetProfileController} from "@/controllers/GetProfileController"
import { authMiddleware } from '@/middlewares/auth-middleware'

export const router = Router()

const createUserController = new CreateUserController()
const signInController = new SignInController()
const getProfileController = new GetProfileController()

router.post('/users', createUserController.handle)
router.post('/sessions', signInController.handle)

router.get('/me', authMiddleware, getProfileController.handle)

