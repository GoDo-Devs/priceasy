import Client from "../models/Client.js";
import Simulation from "../models/Simulation.js";
import User from "../models/User.js";
import VehicleType from "../models/VehicleType.js";
import PriceTable from "../models/PriceTable.js";
import Product from "../models/Product.js";
import ProductGroup from "../models/ProductGroup.js";
import ProductVehicleType from "../models/ProductVehicleType.js";
import Implement from "../models/Implement.js";
import Category from "../models/Category.js";
import Service from "../models/Service.js";
import Plan from "../models/Plan.js";
import PlanService from "../models/PlanService.js";
import VehicleCategory from "../models/VehicleCategory.js";
import UserCoupon from "./UserCoupon.js";
import Coupon from "./Coupon.js";

export const models = {
  Client,
  Simulation,
  User,
  UserCoupon,
  Coupon,
  VehicleType,
  PriceTable,
  Product,
  ProductGroup,
  ProductVehicleType,
  Implement,
  Category,
  Service,
  Plan,
  PlanService,
  VehicleCategory,
};

export const initializeModels = async () => {
  try {
    // Inicializa as associações de todos os modelos
    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });

    console.log("✅ Modelos e associações inicializados com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Erro ao inicializar modelos e associações:", error);
    throw error;
  }
};

export default models;
