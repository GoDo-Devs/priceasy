import VehicleType from "../models/VehicleType.js"
import FipeBrand from "../models/FipeBrand.js";
import FipeTableService from "./FipeTableService.js";
import FipeModel from "../models/FipeModel.js";
import FipeYear from "../models/FipeYear.js";

export default class FipeToDatabaseService {
  fipeService;
  brands;
  models;

  async exec() {
    this.fipeService = new FipeTableService();
    await this.fipeService.setReferenceTable();
    const brands = await this.saveBrands();
    const models = await this.saveModels(brands);
    await this.saveYears(models);
  }

  async saveBrands() {
    const allBrands = [];
    for (const vehicleType of [1, 2, 3]) {
      let responseIsError = true
      let brands = []

      while (responseIsError) {
        try {
          brands = await this.fipeService.searchBrands(vehicleType);

          responseIsError = false
        } catch (error) {
          console.error(error)
        }
      }

      const fipeBrands = brands.map((brand) => {
        return {
          id: brand.Value,
          name: brand.Label,
          vehicle_type_id: vehicleType,
        };
      });


      allBrands.push(...fipeBrands);
    }

     await FipeBrand.bulkCreate(allBrands, {
      updateOnDuplicate: ['name', 'vehicle_type_id'],
    });

    return allBrands;
  }

  async saveModels(brands) {
    const allModels = [];

    for (const brand of brands) {
      let fipeModels = []
      let responseIsError = true

      while (responseIsError) {
        try {
          await this.delay(1000);

          const models = await this.fipeService.searchModels(
            brand.vehicle_type_id,
            brand.id
          );

          fipeModels = models.Modelos.map((model) => {
            return {
              id: model.Value,
              name: model.Label,
              fipe_brand_id: brand.id,
              vehicle_type_id: brand.vehicle_type_id,
            };
          });
    
          await FipeModel.bulkCreate(fipeModels, {
            updateOnDuplicate: ['name', 'fipe_brand_id'],
          });

          allModels.push(...fipeModels);

          responseIsError = false
        } catch (error) {
          console.error(error)
        }
      }
    }

    return allModels;
  }

  async saveYears(models) {
    console.log(models);
    for (const model of models) {
      let responseIsError = true
      let years = []

      while (responseIsError) {
        try {
          await this.delay(1000);

          years = await this.fipeService.searchModelYear(
            model.vehicle_type_id,
            model.fipe_brand_id,
            model.id
          );

          const fipesYears = years.map((year) => {
            return {
              year: year.anoModelo,
              fuel: year.tipoCombustivel,
              fipe_model_id: model.id,
            };
          });

          await FipeYear.bulkCreate(fipesYears, {
            updateOnDuplicate: ['year', 'fuel', 'fipe_model_id'],
          });

          responseIsError = false
        }
        catch (error) {
          console.error(error)
        }
      }
    }
  }

  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
