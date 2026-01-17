import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { createTestUser, isJWT } from '../utils/index'

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
                name: 'Tenant name',
                address: 'Tenant address',
            }
            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            expect(response.statusCode).toBe(201)
        })
    })
})
