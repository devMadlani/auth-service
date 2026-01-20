import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { Tenant } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'
import { createMockTenants, createTenant } from '../utils'

describe('PATCH /tenants/:id', () => {
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
        it('should return 200 status code', async () => {
            const tenantData = {
                name: 'Tenant Name Updated',
                address: 'Tenant Address Updated',
            }
            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(200)
        })
        it('should return 403 if user is not an admin', async () => {
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const tenantData = {
                name: 'Tenant Name Updated',
                address: 'Tenant Address Updated',
            }

            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', `accessToken=${managerToken}`)
                .send(tenantData)

            const tenantRepo = connection.getRepository(Tenant)
            const data = await tenantRepo.find()

            expect(response.statusCode).toBe(403)
        })
        it('should return 400 if id is not positive number', async () => {
            const tenantData = {
                name: 'Tenant Name Updated',
                address: 'Tenant Address Updated',
            }
            const response = await request(app)
                .patch('/tenants/1ab')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(400)
        })

        it('should update tenant data in database', async () => {
            await request(app)
                .post('/tenants')
                .send({ name: 'Tenant Name', address: 'Tenant address' })

            const tenantData = {
                name: 'Tenant Name Updated',
                address: 'Tenant Address Updated',
            }

            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(200)
            const tenantRepo = connection.getRepository(Tenant)
            const data = await tenantRepo.findOne({
                where: { id: response.body.id },
            })
            expect(data?.name).toBe(tenantData.name)
            expect(data?.address).toBe(tenantData.address)
        })

        it('should return update tenant id', async () => {
            await createTenant(connection.getRepository(Tenant))
            const tenantData = {
                name: 'Tenant Name Updated',
                address: 'Tenant Address Updated',
            }

            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.body).toHaveProperty('id')
        })

        it('should return 401 if user is not authenticate', async () => {
            const tenantData = {
                name: 'Tenant Name Updated',
                address: 'Tenant Address Updated',
            }

            const response = await request(app)
                .patch('/tenants/1')
                .send(tenantData)

            const tenantRepo = connection.getRepository(Tenant)
            const data = await tenantRepo.find()

            expect(response.statusCode).toBe(401)
        })
    })

    describe('Fields are missing', () => {
        it('should return 400 status if name field is missing', async () => {
            const tenantData = {
                name: '',
                address: 'Tenant Address Updated',
            }
            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(400)
        })

        it('should return 400 status if address field is missing', async () => {
            const tenantData = {
                name: 'Tenant Name Updated',
                address: '',
            }
            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            expect(response.statusCode).toBe(400)
        })
    })

    describe('Fields are not in proper format', () => {
        it('should trim the name and address fields', async () => {
            const tenantData = {
                name: '   Tenant Name Updated  ',
                address: '     Tenant Address Updated',
            }
            const response = await request(app)
                .patch('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(tenantData)

            const tenantRepo = connection.getRepository(Tenant)
            const data = await tenantRepo.findOne({
                where: { id: response.body.id },
            })
            expect(data?.name).toBe('Tenant Name Updated')
            expect(data?.address).toBe('Tenant Address Updated')
        })
    })
})
