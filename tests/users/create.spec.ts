import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import app from '../../src/app'
import createJWKSMock from 'mock-jwks'
import { Roles } from '../../src/constants'
import { User } from '../../src/entity/User'
import { createTenant } from '../utils'
import { Tenant } from '../../src/entity/Tenant'

describe('POST /users', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    let adminToken: string

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
        it('should persist user in database', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
                tenantId: tenant.id,
                role: Roles.MANAGER,
            }

            await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users).toHaveLength(1)
            expect(users[0].email).toBe(userData.email)
        })

        it('should create a manager user', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))

            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })

            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
                tenantId: tenant.id,
                role: Roles.MANAGER,
            }

            await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users).toHaveLength(1)
            expect(users[0].role).toBe(Roles.MANAGER)
        })
        it('should return 403 if user is not an admin', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            })

            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: ' madlanidev@gmail.com ',
                password: 'Mdr@1234',
                tenantId: tenant.id,
            }

            const response = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${managerToken}`)
                .send(userData)

            const tenantRepo = connection.getRepository(User)
            const data = await tenantRepo.find()

            expect(response.statusCode).toBe(403)
            expect(data).toHaveLength(0)
        })
    })
    describe('Fields are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: '',
                password: 'Mdr@1234',
                role: Roles.MANAGER,
            }

            // Act

            const respone = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if firstName field is missing', async () => {
            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: '',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
                role: Roles.MANAGER,
            }

            // Act

            const respone = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if lastName field is missing', async () => {
            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: 'Dev',
                lastName: '',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
                role: Roles.MANAGER,
            }

            // Act

            const respone = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if password field is missing', async () => {
            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: '',
                role: Roles.MANAGER,
            }

            // Act

            const respone = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if role field is missing', async () => {
            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
                role: '',
            }

            // Act

            const respone = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
    })

    describe('Fields are not in proper format', () => {
        it('should trim the email field', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))

            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: ' madlanidev@gmail.com ',
                password: 'Mdr@1234',
                tenantId: tenant.id,
                role: Roles.MANAGER,
            }

            // Act

            await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user[0].email).toBe('madlanidev@gmail.com')
        })
        it('should return 400 status code if email is invalid', async () => {
            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: ' madlanidevmail.com ',
                password: 'Mdr@1234',
                tenantId: '1',
                role: Roles.MANAGER,
            }

            // Act

            const response = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if password length is less than 8', async () => {
            // Arrange
            adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            })
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: ' madlanidevmail.com ',
                password: 'Mdr@12',
                tenantId: '1',
                role: Roles.MANAGER,
            }

            // Act

            const response = await request(app)
                .post('/users')
                .set('Cookie', `accessToken=${adminToken}`)
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
    })
})
