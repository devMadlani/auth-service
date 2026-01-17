import { checkSchema } from 'express-validator'

export default checkSchema({
    name: {
        errorMessage: 'Name is required',
        notEmpty: true,
        trim: true,
    },
    address: {
        notEmpty: true,
        errorMessage: 'Address is required',
        trim: true,
    },
})
