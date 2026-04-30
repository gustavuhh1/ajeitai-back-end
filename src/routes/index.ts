import { Router } from 'express'
import { CreateUserController } from '@/controllers/CreateUserController'
import { CreateServiceController } from '@/controllers/CreateServiceController'
import { SignInController } from '@/controllers/SignInController'
import { GetProfileController } from '@/controllers/GetProfileController'
import { GetServiceByIdController } from '@/controllers/GetServiceByIdController'
import { ListAvaiableServicesController } from '@/controllers/ListAvaiableServicesController'
import { CreateBudgetController } from '@/controllers/CreateBudgetController'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { GetBudgetsController } from '@/controllers/GetBudgetsController'
import { ForgotPasswordController } from '@/controllers/ForgotPasswordController'

export const router = Router()

const createUserController = new CreateUserController()
const createServiceController = new CreateServiceController()
const signInController = new SignInController()
const getProfileController = new GetProfileController()
const getServiceByIdController = new GetServiceByIdController()
const listAvaiableController = new ListAvaiableServicesController()
const createBudgetController = new CreateBudgetController()
const getBudgetController = new GetBudgetsController()
const forgotPasswordController = new ForgotPasswordController();

router.post('/users', createUserController.handle)
router.post('/sessions', signInController.handle)
router.post('/auth/forgot-password', forgotPasswordController.handle)
router.post('/auth/reset-password', forgotPasswordController.handle)

router.post('/services', authMiddleware, createServiceController.handle)
router.get('/services', authMiddleware, listAvaiableController.handle)
router.get('/services/:id', getServiceByIdController.handle)
router.get('/services/:id/budget', authMiddleware, getBudgetController.handle)
router.post('/services/:id/budgets', authMiddleware, createBudgetController.handle)

router.get('/me', authMiddleware, getProfileController.handle)
