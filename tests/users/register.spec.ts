import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { AppDataSource } from '../../src/config/data-source'
import { DataSource } from 'typeorm'
import truncateTables from '../utils/index'
import { Roles } from '../../src/constants'
describe('POST auth/register', () => {
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
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(201)
        })
        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'))
        })
        it('should persist the user in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            const userRepo = connection.getRepository(User)
            const users = await userRepo.find()
            expect(users).toHaveLength(1)
            expect(users[0].firstName).toBe(userData.firstName)
            expect(users[0].lastName).toBe(userData.lastName)
            expect(users[0].email).toBe(userData.email)
        })
        it("should return register user's id", async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.body).toHaveProperty('id')
            const repository = connection.getRepository(User)
            const user = await repository.find()
            expect((response.body as Record<string, string>).id).toBe(
                user[0].id,
            )
        })
        it('should assing a customer role', async () => {
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert

            const repository = connection.getRepository(User)
            const user = await repository.find()
            expect(user[0]).toHaveProperty('role')
            expect(user[0].role).toBe(Roles.CUSTOMER)
        })
        it('should store the hashed password in database', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user[0].password).not.toBe(userData.password)
            expect(user[0].password).toHaveLength(60)
            expect(user[0].password).toMatch(/^\$2b\$\d+\$/)
        })
        it('should return 400 status code if email already exists', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }
            const userRepository = connection.getRepository(User)
            await userRepository.save({ ...userData, role: Roles.CUSTOMER })

            // Act

            const respone = await request(app)
                .post('/auth/register')
                .send(userData)

            const user = await userRepository.find()
            // Assert
            expect(respone.statusCode).toBe(400)
            expect(user).toHaveLength(1)
        })
    })
    describe('Fields are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: '',
                password: 'Mdr@1234',
            }

            // Act

            const respone = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if firstName field is missing', async () => {
            // Arrange
            const userData = {
                firstName: '',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act

            const respone = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if lastName field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: '',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@1234',
            }

            // Act

            const respone = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(respone.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if password field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: '',
            }

            // Act

            const respone = await request(app)
                .post('/auth/register')
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
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: ' madlanidev@gmail.com ',
                password: 'Mdr@1234',
            }

            // Act

            await request(app).post('/auth/register').send(userData)

            // Assert
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user[0].email).toBe('madlanidev@gmail.com')
        })
        it('should return 400 status code if email is invalid', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev',
                password: 'Mdr@1234',
            }

            // Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const user = await userRepository.find()
            expect(user).toHaveLength(0)
        })
        it('should return 400 status code if password length is less than 8', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: 'madlanidev@gmail.com',
                password: 'Mdr@12',
            }

            // Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(400)
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find()
            expect(users).toHaveLength(0)
        })
        it('should return an array of error if email is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Dev',
                lastName: 'Madlani',
                email: '',
                password: 'Mdr@1234',
            }

            // Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData)

            // Assert
            expect(response.body).toHaveProperty('errors')
            expect(
                (response.body as Record<string, string>).errors.length,
            ).toBeGreaterThan(0)
        })
    })
})
