import express, { NextFunction, Request, Response } from 'express'
import { TenantController } from '../controller/TenantController'
import { TenantService } from '../services/TenantService'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'
import tenantValidators from '../validators/tenant-validators'
import { UserController } from '../controller/UserController'
import { User } from '../entity/User'
import { UserService } from '../services/UserService'
import createUserValidators from '../validators/create-user-validators'

const router = express.Router()

const userRepo = AppDataSource.getRepository(User)
const userService = new UserService(userRepo)

const userController = new UserController(userService)

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    createUserValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
)

// router.patch(
//     '/:id',
//     authenticate,
//     canAccess([Roles.ADMIN]),
//     tenantValidators,
//     (req: Request, res: Response, next: NextFunction) =>
//         tenantController.update(req, res, next),
// )

// router.get(
//     '/',
//     authenticate,
//     canAccess([Roles.ADMIN]),
//     (req: Request, res: Response, next: NextFunction) =>
//         tenantController.getAllTenants(req, res, next),
// )

// router.get(
//     '/:id',
//     authenticate,
//     canAccess([Roles.ADMIN]),
//     (req: Request, res: Response, next: NextFunction) =>
//         tenantController.getOne(req, res, next),
// )

// router.delete(
//     '/:id',
//     authenticate,
//     canAccess([Roles.ADMIN]),
//     (req: Request, res: Response, next: NextFunction) =>
//         tenantController.delete(req, res, next),
// )

export default router
