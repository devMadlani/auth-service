import { Repository } from 'typeorm'
import { Tenant } from '../entity/Tenant'
import { ITenant } from '../types'

export class TenantService {
    constructor(private tenantRepo: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        return await this.tenantRepo.save(tenantData)
    }
    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepo.update(id, tenantData)
    }
    async findAll() {
        return await this.tenantRepo.find({})
    }
    async findById(id: number) {
        return await this.tenantRepo.findOne({ where: { id } })
    }
    async deleteById(id: number) {
        return await this.tenantRepo.delete({ id })
    }
}
