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
import listTenantsValidators from '../validators/list-tenants-validators'

const router = express.Router()

const tenantRepo = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepo)

const tenantController = new TenantController(tenantService, logger)

router.post(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidators,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
)

router.patch(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidators,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next),
)

router.get(
    '/',
    authenticate,
    canAccess([Roles.ADMIN]),
    listTenantsValidators,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getAllTenants(req, res, next),
)

router.get(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getOne(req, res, next),
)

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.delete(req, res, next),
)

export default router
