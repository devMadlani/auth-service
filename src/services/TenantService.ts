import { Repository } from 'typeorm'
import { Tenant } from '../entity/Tenant'
import { ITenant, TenantQueryParams } from '../types'

export class TenantService {
    constructor(private tenantRepo: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        return await this.tenantRepo.save(tenantData)
    }
    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepo.update(id, tenantData)
    }
    async findAll(validatedQuery: TenantQueryParams) {
        const queryBuilder = this.tenantRepo.createQueryBuilder('tenant')

        if (validatedQuery.q) {
            const searchTerm = `%${validatedQuery.q}%`
            queryBuilder.where(
                "CONCAT(tenant.name, ' ', tenant.address) ILike :q",
                { q: searchTerm },
            )
        }

        const result = await queryBuilder
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .orderBy('tenant.id', 'DESC')
            .getManyAndCount()

        return result
    }
    async findById(id: number) {
        return await this.tenantRepo.findOne({ where: { id } })
    }
    async deleteById(id: number) {
        return await this.tenantRepo.delete({ id })
    }
}
