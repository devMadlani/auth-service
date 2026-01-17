import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'

describe('POST /tenants', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
    })
    afterAll(() => {
        connection.destroy()
    })
    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }
            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            expect(response.statusCode).toBe(201)
        })
        it('should create a tenant in database', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            expect(response.statusCode).toBe(201)
            const tenantRepo = AppDataSource.getRepository(Tenant)
            const data = await tenantRepo.find()
            expect(data).toHaveLength(1)
            expect(data[0].name).toBe(tenantData.name)
        })
        it('should return created tenant id', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            expect(response.body).toHaveProperty('id')
        })
    })
})
