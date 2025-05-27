import Joi from "joi";

export const createImplementSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "O nome do implemento é obrigatório!",
  }),
});
