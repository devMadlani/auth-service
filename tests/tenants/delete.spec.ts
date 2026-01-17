import createJWKSMock from 'mock-jwks'
import { AppDataSource } from '../../src/config/data-source'
import { DataSource } from 'typeorm'
import { Roles } from '../../src/constants'
import request from 'supertest'
import app from '../../src/app'

describe('DELETE', () => {
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
    describe('Delete /tenants/:id', () => {
        it('should return 200 status code', async () => {
            const response = await request(app)
                .delete('/tenants/1')
                .set('Cookie', `accessToken=${adminToken}`)

            expect(response.statusCode).toBe(200)
        })

        it('should return 401 if user is not authenticate', async () => {
            const response = await request(app).delete('/tenants/1')

            expect(response.statusCode).toBe(401)
        })

        it('should return 400 if id is not positive number', async () => {
            const response = await request(app)
                .delete('/tenants/1ab')
                .set('Cookie', `accessToken=${adminToken}`)

            expect(response.statusCode).toBe(400)
        })

        it('should return 403 if user is not an admin', async () => {
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const response = await request(app)
                .delete('/tenants/1')
                .set('Cookie', `accessToken=${managerToken}`)

            expect(response.statusCode).toBe(403)
        })
    })
})
