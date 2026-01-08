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
                password: 'Mdr@123',
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
                password: 'Mdr@123',
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
                password: 'Mdr@123',
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
                password: 'Mdr@123',
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
                password: 'Mdr@123',
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
    })
    describe('Fields are missing', () => {})
})
