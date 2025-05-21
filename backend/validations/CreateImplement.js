import Joi from "joi";

export const createImplementSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "O nome do implemento é obrigatório!",
  }),

  price: Joi.number().precision(2).required().messages({
    "number.base": "O preço deve ser um número válido.",
    "any.required": "O preço é obrigatório.",
  }),
});
