import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        errorMessage: 'Email is required',
        trim: true,
        notEmpty: true,
    },
})
