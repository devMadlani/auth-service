import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import createJWKSMock from 'mock-jwks'
import { createTestUser } from '../utils'
import { Roles } from '../../src/constants'

describe('POST /auth/self', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()
    })
    afterEach(() => {
        jwks.stop()
    })
    afterAll(() => {
        connection.destroy()
    })
    describe('Given all fields', () => {
        it('should return 200 status code', async () => {
            const accessToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            })
            console.log(accessToken)
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()

            expect(response.statusCode).toBe(200)
        })

        it('should return user data', async () => {
            //Arrange
            const user = await createTestUser()
            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            })

            //Act

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()

            //Assert
            expect(response.body.id).toBe(user.id)
        })

        it('should not return password field', async () => {
            // Arrange
            const user = await createTestUser()
            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            })

            //Act

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send()

            // Assert
            expect(response.body).not.toHaveProperty('password')
        })
    })
})
