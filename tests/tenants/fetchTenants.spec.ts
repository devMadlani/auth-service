import request from 'supertest'
import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import { Roles } from '../../src/constants'
import { DataSource } from 'typeorm'
import app from '../../src/app'
import { createMockTenants } from '../utils'
import { Tenant } from '../../src/entity/Tenant'

describe('GET /tenants or /tenants/:id', () => {
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
        await createMockTenants()
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

    describe('GET /tenants', () => {
        it('should return 200 status code', async () => {
            const response = await request(app)
                .get('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)

            expect(response.statusCode).toBe(200)
        })

        it('should return 401 if user is not authenticate', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app).get('/tenants').send(tenantData)

            expect(response.statusCode).toBe(401)
        })

        it('should return 200 status code and empty array when no tenant', async () => {
            await connection.dropDatabase()
            await connection.synchronize()
            const response = await request(app)
                .get('/tenants')
                .set('Cookie', `accessToken=${adminToken}`)

            expect(response.statusCode).toBe(200)
            expect(response.body).toStrictEqual({ tenants: [] })
        })
        it('should return 403 if user is not an admin', async () => {
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app)
                .get('/tenants')
                .set('Cookie', `accessToken=${managerToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(403)
        })
    })

    describe('GET /tenants/:id', () => {
        it('should return 200 status code', async () => {
            const response = await request(app)
                .get('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)

            expect(response.statusCode).toBe(200)
        })

        it('should return 401 if user is not authenticate', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app)
                .get('/tenants/1')
                .send(tenantData)

            expect(response.statusCode).toBe(401)
        })

        it('should return 400 if id is not positive number', async () => {
            const response = await request(app)
                .get('/tenants/1ab')
                .set('Cookie', `accessToken=${adminToken}`)

            expect(response.statusCode).toBe(400)
        })

        it('should return 400 if tenant not found', async () => {
            const response = await request(app)
                .get('/tenants/12323')
                .set('Cookie', `accessToken=${adminToken}`)

            expect(response.statusCode).toBe(400)
        })
        it('should return 403 if user is not an admin', async () => {
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const tenantData = {
                name: 'Tenant Name',
                address: 'Tenant Address',
            }

            const response = await request(app)
                .get('/tenants/1')
                .set('Cookie', `accessToken=${managerToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(403)
        })
    })
})
