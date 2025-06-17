import * as yup from "yup";

const editUserValidator = yup.object({
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
    .notRequired()
    .test(
      "password-validation",
      "A senha deve ter entre 6 e 30 caracteres e conter apenas letras, números e @#$%!",
      (value) => {
        if (!value || value.trim() === "") return true;
        const regex = /^[a-zA-Z0-9@#$%!]+$/;
        return regex.test(value) && value.length >= 6 && value.length <= 30;
      }
    ),

  is_admin: yup
    .boolean()
    .required("O campo administrador deve ser verdadeiro ou falso.")
    .typeError("O campo administrador deve ser verdadeiro ou falso."),
});

export default editUserValidator;
