import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import { createTestUser, isJWT } from '../utils/index'
import { User } from '../../src/entity/User'

describe('POST /auth/login', () => {
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
        it('should return 200 status code', async () => {
            // Arrange
            await createTestUser()
            const userData = {
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            //Assert
            expect(response.statusCode).toBe(200)
        })

        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            )
        })
        it('should return 400 if email is not found', async () => {
            await createTestUser()
            // Arrange
            const userData = {
                email: 'madlanidev@mail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            expect(response.statusCode).toBe(400)
        })
        it('should return 400 if password is wrong', async () => {
            // Arrange

            await createTestUser()
            const userData = {
                email: 'madlanidev@gmail.com',
                password: 'Mdr@234',
            }

            // Act

            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            expect(response.statusCode).toBe(400)
        })

        it('should return access token and refresh token inside a cookie', async () => {
            // Arrange
            await createTestUser()
            const userData = {
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            interface Headers {
                ['set-cookie']?: string[]
            }
            // Assert
            let accessToken = null
            let refreshToken = null
            const cookies = (response.headers as Headers)['set-cookie'] || []

            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1]
                }
                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1]
                }
            })

            expect(accessToken).not.toBeNull()

            expect(refreshToken).not.toBeNull()
            expect(isJWT(accessToken)).toBeTruthy()
            expect(isJWT(refreshToken)).toBeTruthy()
        })

        it('should return login user"s id ', async () => {
            await createTestUser()
            const userData = {
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            //Assert

            expect(response.body).toHaveProperty('id')
            const userRepository = connection.getRepository(User)
            const user = await userRepository.findOne({
                where: { email: userData.email },
            })
            expect(response.body.id).toBe(user?.id)
        })
    })
    describe('Fields are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                email: '',
                password: 'Mdr@1234',
            }

            // Act

            const respone = await request(app)
                .post('/auth/login')
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
        })
        it('should return 400 status code if password field is missing', async () => {
            // Arrange
            const userData = {
                email: 'madlanidev@gmail.com',
                password: '',
            }

            // Act

            const respone = await request(app)
                .post('/auth/login')
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
        })
    })

    describe('Fields are not in proper format', () => {
        it('should return 400 status code if email is invalid', async () => {
            // Arrange
            const userData = {
                email: 'madlanidev',
                password: 'Mdr@1234',
            }

            // Act

            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
        })
    })
})
