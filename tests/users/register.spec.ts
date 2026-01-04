import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/entity/User'
import { AppDataSource } from '../../src/config/data-source'
import { DataSource } from 'typeorm'
import truncateTables from '../utils/index'
describe('POST auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        // Database truncate
        await truncateTables(connection)
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
    })
    describe('Fields are missing', () => {})
})
