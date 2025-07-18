import Joi from "joi";

export const registerSchema = Joi.object({
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

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Formato de e-mail inválido!",
      "string.empty": "O e-mail é obrigatório!",
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(/^[a-zA-Z0-9@#$%!]+$/)
    .required()
    .messages({
      "string.min": "A senha deve ter no mínimo 6 caracteres.",
      "string.pattern.base":
        "A senha pode conter apenas letras, números e @#$%!",
      "string.empty": "A senha é obrigatória!",
    }),

  confirmpassword: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "As senhas não conferem!",
    "any.required": "A confirmação de senha é obrigatória!",
  }),

  is_admin: Joi.boolean().optional().messages({
    "boolean.base": "O campo administrador deve ser verdadeiro ou falso.",
  }),
});

export const editUserSchema = Joi.object({
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

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Formato de e-mail inválido!",
      "string.empty": "O e-mail é obrigatório!",
    }),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9@#$%!]+$/)
    .min(6)
    .optional()
    .allow(null, "")
    .messages({
      "string.min": "A senha deve ter no mínimo 6 caracteres.",
      "string.pattern.base":
        "A senha pode conter apenas letras, números e @#$%!",
    }),

  is_admin: Joi.boolean().required().messages({
    "any.required": "O campo administrador deve ser verdadeiro ou falso.",
    "boolean.base": "O campo administrador deve ser verdadeiro ou falso.",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.empty": "O e-mail é obrigatório!",
  }),
  password: Joi.string().required().messages({
    "string.empty": "A senha é obrigatória!",
  }),
});
