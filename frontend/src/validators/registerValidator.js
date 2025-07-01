import * as yup from "yup";

const registerValidator = yup.object({
  name: yup
    .string()
    .required("O nome é obrigatório!")
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(100)
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras e espaços."),

  email: yup
    .string()
    .required("O e-mail é obrigatório!")
    .email("Formato de e-mail inválido!"),

  password: yup
    .string()
    .required("A senha é obrigatória!")
    .min(6, "A senha deve ter no mínimo 6 caracteres.")
    .max(30)
    .matches(
      /^[a-zA-Z0-9@#$%!]+$/,
      "A senha pode conter apenas letras, números e @#$%!"
    ),

  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não conferem!")
    .required("A confirmação de senha é obrigatória!"),

  is_admin: yup
    .boolean()
    .optional()
    .typeError("O campo administrador deve ser verdadeiro ou falso."),
});

export default registerValidator;
