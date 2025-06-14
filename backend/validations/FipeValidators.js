import Joi from "joi";

const vehicleType = Joi.number().valid(1, 2, 3).required();
const brandCode = Joi.number().required();
const modelCode = Joi.number().required();
const modelYear = Joi.number().required(); 
const fuelType = Joi.number().valid(1, 2, 3).required();

export const brandsSchema = Joi.object({
  vehicleType,
});

export const modelsSchema = Joi.object({
  vehicleType,
  brandCode,
});

export const modelYearSchema = Joi.object({
  vehicleType,
  brandCode,
  modelCode,
});

export const priceSchema = Joi.object({
  vehicleType,
  brandCode,
  modelCode,
  modelYear,
  fuelType,
});
