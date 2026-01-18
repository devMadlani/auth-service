import { DataSource, Repository } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import { User } from '../../src/entity/User'
import bcrypt from 'bcrypt'
import { Roles } from '../../src/constants'
import { Tenant } from '../../src/entity/Tenant'

export const truncateTables = async (connection: DataSource) => {
    const entites = connection.entityMetadatas
    for (const entity of entites) {
        const repositry = connection.getRepository(entity.name)
        await repositry.clear()
    }
}

export const isJWT = (token: string | null): boolean => {
    if (!token) return false
    const parts = token.split('.')
    if (parts.length != 3) {
        return false
    }
    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf-8')
        })
        return true
    } catch (err) {
        return false
    }
}

export const createTestUser = async () => {
    const userRepo = AppDataSource.getRepository(User)

    const hashedPassword = await bcrypt.hash('Mdr@1234', 10)

    const user = userRepo.create({
        firstName: 'Dev',
        lastName: 'Madlani',
        role: Roles.CUSTOMER,
        email: 'madlanidev@gmail.com',
        password: hashedPassword,
    })

    return await userRepo.save(user)
}

export const createMockTenants = async () => {
    const tenantRepo = AppDataSource.getRepository(Tenant)
    for (let i = 0; i < 5; i++) {
        await tenantRepo.save({ name: `Tenant ${i}`, address: `Address ${i}` })
    }
}

export const createTenant = async (repository: Repository<Tenant>) => {
    const tenant = await repository.save({
        name: 'Test Name',
        address: 'Test Address',
    })

    return tenant
}
