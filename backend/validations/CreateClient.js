import Joi from "joi";

const cpfRegex = /^\d{11}$/;
const phoneRegex = /^\d{10,11}$/;

export const createClientSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required()
    .messages({
      "string.empty": "O nome é obrigatório!",
      "string.min": "O nome deve ter no mínimo 3 caracteres.",
      "string.pattern.base": "O nome deve conter apenas letras e espaços.",
    }),

  cpf: Joi.string().pattern(cpfRegex).required().messages({
    "string.pattern.base": "O CPF deve conter 11 números",
    "string.empty": "O CPF é obrigatório",
  }),

  phone: Joi.string().pattern(phoneRegex).required().messages({
    "string.pattern.base": "O telefone deve ter 10 ou 11 dígitos numéricos",
    "string.empty": "O telefone é obrigatório",
  }),
});
