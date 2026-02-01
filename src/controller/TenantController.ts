import { NextFunction, Request, Response } from 'express'
import { TenantService } from '../services/TenantService'
import { CreateTenantRequest, TenantQueryParams } from '../types'
import { Logger } from 'winston'
import { matchedData, validationResult } from 'express-validator'
import createHttpError from 'http-errors'

export class TenantController {
    constructor(
        private tenantSerive: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
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

    async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string))
        }
        const { name, address } = req.body
        const tenantId = req.params.id
        if (Number.isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param'))
            return
        }

        this.logger.debug('Request for updating a tenant', req.body)

        try {
            await this.tenantSerive.update(Number(tenantId), { name, address })
            this.logger.info('Tenant has been updated', { id: tenantId })

            res.json({ id: Number(tenantId) })
        } catch (err) {
            next(err)
        }
    }

    async getAllTenants(req: Request, res: Response, next: NextFunction) {
        const validatedQuery = matchedData(req, { onlyValidData: true })
        try {
            const [tenants, count] = await this.tenantSerive.findAll(
                validatedQuery as TenantQueryParams,
            )

            this.logger.info('All tenant have been fetched')
            res.json({
                currentPage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                total: count,
                data: tenants,
            })
        } catch (err) {
            next(err)
        }
    }
    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id
        if (Number.isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param'))
            return
        }
        try {
            const tenant = await this.tenantSerive.findById(Number(tenantId))

            if (!tenant) {
                next(createHttpError(400, 'Tenant does not exist.'))
                return
            }
            this.logger.info('Tenants fetched successfully', { id: tenant.id })

            res.status(200).json(tenant)
        } catch (err) {
            next(err)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id
        if (Number.isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param'))
            return
        }
        try {
            await this.tenantSerive.deleteById(Number(tenantId))
            this.logger.info('Tenant has been deleted', {
                id: Number(tenantId),
            })
            res.json({ id: Number(tenantId) })
        } catch (err) {
            next(err)
        }
    }
}
