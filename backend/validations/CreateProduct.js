import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "O nome do produto é obrigatório!",
    "string.min": "O nome do produto deve ter pelo menos 1 caracter.",
  }),

  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "O preço deve ser um número válido.",
    "number.positive": "O preço deve ser maior que zero.",
    "any.required": "O preço é obrigatório.",
  }),

  product_group_id: Joi.number()
  .allow(null) 
  .allow(0)
  .optional(),

  group_name: Joi.string()
    .min(2)
    .max(100)
    .when("product_group_id", {
      is: 0,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.base": "O nome do grupo deve ser um texto.",
      "string.min": "O nome do grupo deve ter pelo menos 2 caracteres.",
    }),

  vehicle_type_ids: Joi.array()
    .items(Joi.number().integer().positive().messages({
      "number.base": "Cada tipo de veículo deve ser um número.",
      "number.integer": "O ID do tipo de veículo deve ser um número inteiro.",
      "number.positive": "O ID do tipo de veículo deve ser positivo.",
    }))
    .min(1)
    .required()
    .messages({
      "array.base": "Tipos de veículo devem ser enviados em um array.",
      "array.min": "Selecione pelo menos um tipo de veículo.",
      "any.required": "É obrigatório selecionar pelo menos um tipo de veículo.",
    }),
});
