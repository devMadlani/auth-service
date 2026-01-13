import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types'
import createHttpError from 'http-errors'
import { Roles } from '../constants'
import bcrypt from 'bcrypt'

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        })

        if (user) {
            const err = createHttpError(400, 'Email is already exists')
            throw err
        }

        // Hash Password
        const saltRounds = 10
        const hashedPassweord = await bcrypt.hash(password, saltRounds)

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassweord,
                role: Roles.CUSTOMER,
            })
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to store data in database',
            )
            throw error
        }
    }
    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } })
    }
    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } })
    }
}
