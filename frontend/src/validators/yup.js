import * as yupLib from 'yup';

const translation = {
    mixed: {
        default: 'Campo é inválido',
        required: 'Este campo é obrigatório',
        oneOf: 'O campo deve ser um dos seguintes valores disponíveis',
        notOneOf: 'Este campo não pode ser um dos seguintes valores: ${values}',
    },
    string: {
        length: 'Este campo deve ter exatamente ${length} caracteres',
        min: 'Este campo deve ter pelo menos ${min} caracteres',
        max: 'Este campo deve ter no máximo ${max} caracteres',
        email: 'Insira um Email válido',
        url: 'Este campo deve ter um formato de URL válida',
        trim: 'Este campo não deve conter espaços no início ou no fim.',
        lowercase: 'Este campo deve estar em maiúsculo',
        uppercase: 'Este campo deve estar em minúsculo',
    },
    number: {
        min: 'Este campo deve ser no mínimo ${min}',
        max: 'Este campo deve ser no máximo ${max}',
        lessThan: 'Este campo deve ser menor que ${less}',
        moreThan: 'Este campo deve ser maior que ${more}',
        notEqual: 'Este campo não pode ser igual à ${notEqual}',
        positive: 'Este campo deve ser um número positivo',
        negative: 'Este campo deve ser um número negativo',
        integer: 'Este campo deve ser um número inteiro',
    },
    date: {
        min: 'Este campo deve ser maior que a data ${min}',
        max: 'Este campo deve ser menor que a data ${max}',
    },
    array: {
        min: 'Este campo deve ter no mínimo ${min} itens',
        max: 'Este campo deve ter no máximo ${max} itens',
    },
};
yupLib.setLocale(translation);

export default yupLib;