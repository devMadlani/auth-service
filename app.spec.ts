import request from 'supertest'
import { calculateDiscount } from './src/utils'
import app from './src/app'

describe('App', () => {
    it('should return correct discount amount', () => {
        const discount = calculateDiscount(100, 10)
        expect(discount).toBe(10)
    })

    it('should return 200 status code', async () => {
        const respone = await request(app).get('/').send()
        expect(respone.statusCode).toBe(200)
    })
})
