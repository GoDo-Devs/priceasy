import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "O nome do produto é obrigatório!",
  }),

  price: Joi.number().precision(2).required().messages({
    "number.base": "O preço deve ser um número válido.",
    "any.required": "O preço é obrigatório.",
  }),

  product_group_id: Joi.number()
  .allow(null) 
  .allow(0)
  .optional(),

  group_name: Joi.string()
    .when("product_group_id", {
      is: 0,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.base": "O nome do grupo deve ser um texto.",
    }),

  vehicle_type_ids: Joi.array()
    .items(Joi.number().integer().positive().messages({
      "number.integer": "O ID do tipo de veículo deve ser um número inteiro.",
      "number.positive": "O ID do tipo de veículo deve ser positivo.",
    }))
    .messages({
      "array.base": "Tipos de veículo devem ser enviados em um array.",
    }),
});
