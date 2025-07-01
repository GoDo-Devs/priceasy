import * as yup from 'yup';

const loginValidator = yup.object({
  email: yup
    .string()
    .required('O e-mail é obrigatório!')
    .email('Formato de e-mail inválido!'),

  password: yup
    .string()
    .required('A senha é obrigatória!'),
});

export default loginValidator;
