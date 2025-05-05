import yup from './yup'

const loginValidator = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required()
});

export default loginValidator;