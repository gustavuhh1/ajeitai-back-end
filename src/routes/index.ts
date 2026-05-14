import { Router } from 'express'
import { CreateUserController } from '@/controllers/CreateUserController'
import { CreateServiceController } from '@/controllers/CreateServiceController'
import { SignInController } from '@/controllers/SignInController'
import { GetProfileController } from '@/controllers/GetProfileController'
import { GetServiceByIdController } from '@/controllers/GetServiceByIdController'
import { ListAvaiableServicesController } from '@/controllers/ListAvaiableServicesController'
import { CreateBudgetController } from '@/controllers/CreateBudgetController'
import { authMiddleware } from '@/middlewares/auth-middleware'
import { ForgotPasswordController } from '@/controllers/ForgotPasswordController'
import { ResetPasswordController } from "@/controllers/ResetPasswordController";
import {GetBudgetsController} from "@/controllers/GetBudgetsController";
import {GetProviderBookingsController} from '@/controllers/GetProviderBookingsController'
import { AcceptBudgetController } from '@/controllers/AcceptBudgetController'
import { CreatePaymentController } from '@/controllers/CreatePaymentController'
import { CreateReviewController } from '@/controllers/CreateReviewController'
import { UpdateBookingStatusController } from '@/controllers/UpdateBookingStatusController'
import {ensureRole} from '@/middlewares/ensure-role'

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
const resetPasswordController = new ResetPasswordController();
const getProviderBookingsController = new GetProviderBookingsController()
const acceptBudgetController = new AcceptBudgetController()
const createPaymentController = new CreatePaymentController()
const createReviewController = new CreateReviewController()
const updateBookingStatusController = new UpdateBookingStatusController()

router.post('/users', createUserController.handle)
router.post('/sessions', signInController.handle)
router.post('/auth/forgot-password', forgotPasswordController.handle)
router.post('/auth/reset-password', resetPasswordController.handle)
router.get('/services/:id', getServiceByIdController.handle)

router.get('/me', authMiddleware, getProfileController.handle)

router.post('/services', authMiddleware, createServiceController.handle)
router.get('/services', authMiddleware, listAvaiableController.handle)
router.get('/services/:id/budget', authMiddleware, getBudgetController.handle)
router.post('/services/:id/budgets', authMiddleware, createBudgetController.handle)

router.patch('/client/services/:serviceId/budgets/:budgetId/accept', authMiddleware, ensureRole('CLIENT'), acceptBudgetController.handle)
router.post('/client/bookings/:id/payment', authMiddleware, ensureRole('CLIENT'), createPaymentController.handle)

router.get('/provider/bookings', authMiddleware, ensureRole('PROVIDER') ,getProviderBookingsController.handle)

router.post('/reviews', authMiddleware, ensureRole('CLIENT'), createReviewController.handle)

router.patch('/bookings/:id/status', authMiddleware, ensureRole('PROVIDER'), updateBookingStatusController.handle)