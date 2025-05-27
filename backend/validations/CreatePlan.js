import Joi from "joi";

export const cratePlanSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "O nome do produto é obrigatório!",
  }),

  price: Joi.number().precision(2).optional().messages({
    "number.base": "O preço deve ser um número válido.",
    "any.required": "O preço é obrigatório.",
  }),

  type_vehicle_id: Joi.number()
  .required
  .allow(null) 
  .allow(0)
  .optional(),

  services_id: Joi.array()
    .items(Joi.number().required.integer().positive().messages({
      "number.integer": "O ID do plano deve ser um número inteiro.",
      "number.positive": "O ID do plano deve ser positivo.",
    }))
    .messages({
      "array.base": "Tipos de veículo devem ser enviados em um array.",
    }),
});
