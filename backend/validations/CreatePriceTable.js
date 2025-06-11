import Joi from "joi";

const pricePlanIdSchema = Joi.object({
  plan_id: Joi.number().required(),
  basePrice: Joi.number().required(),
});

const rangeSchema = Joi.object({
  min: Joi.number().required(),
  max: Joi.number().greater(Joi.ref("min")).required(),
  quota: Joi.number().required(),
  accession: Joi.number().required(),
  basePrice: Joi.number().required(),
  installationPrice: Joi.number().optional(),
  pricePlanId: Joi.array().items(pricePlanIdSchema).required(),
});

const rangesSchema = Joi.array().items(rangeSchema);

const priceTableSchema = Joi.object({
  name: Joi.string().required(),
  vehicle_type_id: Joi.number().required(),
  brands: Joi.array().items(Joi.number()).optional(),
  category_id: Joi.number().required(),
  plansSelected: Joi.array().items(Joi.number()).required(),
  ranges: rangesSchema.required(),
});

function checkRangeConflicts(ranges) {
  const sortedRanges = [...ranges].sort((a, b) => a.min - b.min);

  for (let i = 0; i < sortedRanges.length - 1; i++) {
    const current = sortedRanges[i];
    const next = sortedRanges[i + 1];
    if (next.min <= current.max) {
      throw new Error(
        `Conflito entre os intervalos [${current.min}, ${current.max}] e [${next.min}, ${next.max}]`
      );
    }
  }
}

export function validatePriceTable(priceTable) {
  const { error } = priceTableSchema.validate(priceTable);

  if (error) {
    throw new Error(`Erro de validação da tabela de preço: ${error.message}`);
  }

  checkRangeConflicts(priceTable.ranges);
}
