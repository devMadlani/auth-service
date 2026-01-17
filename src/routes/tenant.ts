import express, { NextFunction, Request, Response } from 'express'
import { TenantController } from '../controller/TenantController'

const router = express.Router()

const tenantController = new TenantController()

router.post('/', (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
)

export default router
