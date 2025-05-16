import * as Yup from "yup";

export const productValidator = Yup.object().shape({
  name: Yup.string()
    .required("O nome do produto é obrigatório!")
    .min(1, "O nome do produto deve ter pelo menos 1 caracter.")
    .max(100, "O nome do produto deve ter no máximo 100 caracteres."),

  price: Yup.number()
    .typeError("O preço deve ser um número válido.")
    .positive("O preço deve ser maior que zero.")
    .required("O preço é obrigatório.")
    .test(
      "max-two-decimals",
      "O preço deve ter no máximo duas casas decimais.",
      (value) => /^\d+(\.\d{1,2})?$/.test(value)
    ),

  product_group_id: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "Nenhum" || originalValue === "" ? null : value
    ),

  group_name: Yup.string()
    .min(2, "O nome do grupo deve ter pelo menos 2 caracteres.")
    .max(100, "O nome do grupo deve ter no máximo 100 caracteres.")
    .when("product_group_id", {
      is: (val) => val === null || val === 0,
      then: (schema) => schema.required("O nome do grupo é obrigatório."),
      otherwise: (schema) => schema.notRequired(),
    }),
});
