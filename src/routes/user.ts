import express, { NextFunction, Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'
import tenantValidators from '../validators/tenant-validators'
import { UserController } from '../controller/UserController'
import { User } from '../entity/User'
import { UserService } from '../services/UserService'
import createUserValidators from '../validators/create-user-validators'
import updateUserValidatores from '../validators/update-user-validatores'
import { UpdateUserRequest } from '../types'

const router = express.Router()

const userRepo = AppDataSource.getRepository(User)
const userService = new UserService(userRepo)

const userController = new UserController(userService, logger)

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    createUserValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
)

router.patch(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    updateUserValidatores,
    (req: UpdateUserRequest, res: Response, next: NextFunction) =>
        userController.update(req, res, next),
)

router.get(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.getAll(req, res, next),
)

router.get(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.getOne(req, res, next),
)

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.delete(req, res, next),
)

export default router
