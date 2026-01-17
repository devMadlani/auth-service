import { NextFunction, Request, Response } from 'express'
import { TenantService } from '../services/TenantService'
import { CreateTenantRequest } from '../types'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'

export class TenantController {
    constructor(
        private tenantSerive: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }
        const { name, address } = req.body
        this.logger.debug('Request for creating Tenant', req.body)
        try {
            const tenant = await this.tenantSerive.create({ name, address })
            this.logger.info('Tenant has been created', { id: tenant.id })
            res.status(201).json({ id: tenant.id })
        } catch (err) {
            next(err)
        }
    }

    async getAllTenants(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantSerive.findAll()
            this.logger.info('Tenants fetched successfully')
            res.status(200).json({ tenants })
        } catch (err) {
            next(err)
        }
    }
    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param'))
            return
        }
        try {
            const tenant = await this.tenantSerive.findById(Number(tenantId))

            if (!tenant) {
                next(createHttpError(400, 'Tenant does not exist.'))
                return
            }
            res.status(200).json({ tenant })
        } catch (err) {
            next(err)
        }
    }

    delete(req: Request, res: Response, next: NextFunction) {
        return res.status(200).json({})
    }
}
