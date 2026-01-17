import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'

describe('POST /tenants', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    let adminToken: string

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
        jwks.start()
        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        })
    })

    afterEach(() => {
        jwks.stop()
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
                .set('Cookie', `accessToken=${adminToken}`)
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
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(201)
            const tenantRepo = AppDataSource.getRepository(Tenant)
            const data = await tenantRepo.find()
            expect(data).toHaveLength(1)
            expect(data[0].name).toBe(tenantData.name)
            expect(data[0].address).toBe(tenantData.address)
        })

        it('should return created tenant id', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app)
                .post('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.body).toHaveProperty('id')
        })

        it('should return 401 if user is not authenticate', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            const tenantRepo = AppDataSource.getRepository(Tenant)
            const data = await tenantRepo.find()

            expect(response.statusCode).toBe(401)
            expect(data).toHaveLength(0)
        })
    })
})
