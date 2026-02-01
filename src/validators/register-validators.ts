import { checkSchema } from 'express-validator'

export default checkSchema({
    firstName: {
        errorMessage: 'First Name is required',
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: 'Last Name is required',
        notEmpty: true,
        trim: true,
    },
    email: {
        errorMessage: 'Email is required',
        trim: true,
        notEmpty: true,
        isEmail: {
            errorMessage: 'Please enter valid email',
        },
    },
    password: {
        trim: true,
        notEmpty: true,
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password should be at least 8 chars',
        },
    },
})
