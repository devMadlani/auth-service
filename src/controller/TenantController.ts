import { NextFunction, Request, Response } from 'express'

export class TenantController {
    constructor() {}
    create(req: Request, res: Response, next: NextFunction) {
        res.status(201).send()
    }
}
