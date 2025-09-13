import Joi from "joi";

export const createCouponSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "O nome do cupom é obrigatório!",
    "any.required": "O nome do cupom é obrigatório!",
  }),

  is_active: Joi.boolean().required().messages({
    "boolean.base": "O campo 'ativo' deve ser verdadeiro ou falso.",
    "any.required": "O campo 'ativo' é obrigatório.",
  }),

  discountPercentage: Joi.number().min(0).max(100).required().messages({
    "number.base": "A porcentagem de desconto deve ser um número válido.",
    "number.min": "A porcentagem de desconto não pode ser menor que 0.",
    "number.max": "A porcentagem de desconto não pode ser maior que 100.",
    "any.required": "A porcentagem de desconto é obrigatória.",
  }),

  target: Joi.string()
    .valid("accession", "monthlyFee", "installationPrice")
    .required()
    .messages({
      "any.only":
        "O campo 'target' deve ser um dos seguintes valores: accession, monthlyFee, installationPrice.",
      "any.required": "O campo 'target' é obrigatório.",
    }),

  users_ids: Joi.array()
    .items(
      Joi.string().uuid().messages({
        "string.guid": "Cada ID de usuário deve ser um UUID válido.",
        "string.base": "Cada ID de usuário deve ser uma string.",
      })
    )
    .optional()
    .messages({
      "array.base": "O campo 'users_ids' deve ser um array de IDs.",
    }),
});
