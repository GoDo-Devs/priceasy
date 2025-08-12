import Simulation from "../models/Simulation.js";
import Client from "../models/Client.js";
import VehicleType from "../models/VehicleType.js";
import { Op } from "sequelize";
import sequelize from "../db/index.js";
import FipeBrand from "../models/FipeBrand.js";
import FipeModel from "../models/FipeModel.js";

export default class SimulationController {
  static async createSimulation(req, res) {
    try {
      const {
        client_id,
        vehicle_type_id,
        brand_id,
        model_id,
        year,
        price_table_id,
        protectedValue,
        plate,
        selectedProducts,
        plan_id,
        fipeValue,
        fipeCode,
        name,
        monthlyFee,
        accession,
        installationPrice,
        isFranchisePercentage,
        franchiseValue,
        implementList,
        discountedAccession,
        discountedAccessionCouponId,
        discountedMonthlyFee,
        discountedMonthlyFeeCouponId,
        discountedInstallationPrice,
        discountedInstallationPriceCouponId,
        valueSelectedProducts,
      } = req.body;

      const user_id = req.user?.id;

      if (!user_id || client_id == null) {
        return res
          .status(400)
          .json({ error: "Usuário ou cliente não informado." });
      }

      const simulation = await Simulation.create({
        user_id,
        client_id,
        fipeValue: fipeValue ?? null,
        fipeCode: fipeCode ?? null,
        name: name ?? null,
        vehicle_type_id: vehicle_type_id ?? null,
        brand_id: brand_id ?? null,
        model_id: model_id ?? null,
        year: year ?? null,
        price_table_id: price_table_id ?? null,
        protectedValue: protectedValue ?? null,
        plate: plate ?? null,
        selectedProducts: Array.isArray(selectedProducts)
          ? selectedProducts
          : [],
        plan_id: plan_id ?? null,
        monthlyFee: monthlyFee ?? null,
        accession: accession ?? null,
        installationPrice: installationPrice ?? null,
        isFranchisePercentage: isFranchisePercentage ?? null,
        franchiseValue: franchiseValue ?? null,
        implementList: Array.isArray(implementList) ? implementList : [],
        discountedAccession: discountedAccession ?? null,
        discountedAccessionCouponId: discountedAccessionCouponId ?? null,
        discountedMonthlyFee: discountedMonthlyFee ?? null,
        discountedMonthlyFeeCouponId: discountedMonthlyFeeCouponId ?? null,
        discountedInstallationPrice: discountedInstallationPrice ?? null,
        discountedInstallationPriceCouponId:
          discountedInstallationPriceCouponId ?? null,
        valueSelectedProducts: valueSelectedProducts ?? null,
      });

      return res.status(201).json(simulation);
    } catch (error) {
      console.error("Erro ao criar simulação:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  static async getAllSimulations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const offset = (page - 1) * limit;

      const where = {};
      if (!req.user.isAdmin) {
        where.user_id = req.user.id;
      }

      const { count, rows: simulations } = await Simulation.findAndCountAll({
        where,
        attributes: [
          "id",
          "user_id",
          "client_id",
          "vehicle_type_id",
          "brand_id",
          "model_id",
          "year",
          "price_table_id",
          "plate",
          "protectedValue",
          "fipeValue",
          "fipeCode",
          "name",
          "plan_id",
          "monthlyFee",
          "valueSelectedProducts",
          "implementList",
          "selectedProducts",
          "accession",
          "installationPrice",
          "discountedAccession",
          "discountedMonthlyFee",
          "discountedInstallationPrice",
          "discountedAccessionCouponId",
          "discountedMonthlyFeeCouponId",
          "discountedInstallationPriceCouponId",
          "isFranchisePercentage",
          "franchiseValue",
          "created_at",
          "updated_at",
        ],
        order: [["created_at", "DESC"]],
        limit,
        offset,
        include: [
          {
            model: Client,
            as: "client",
            attributes: ["id", "name"],
          },
          {
            model: VehicleType,
            as: "vehicleType",
            attributes: ["id", "name"],
          },
        ],
      });

      simulations.forEach((simulation) => {
        const brand = FipeBrand.findByPk(simulation.brand_id);
        const model = FipeModel.findByPk(simulation.model_id);

        simulation.brand = brand;
        simulation.model = model;
      });

      return res.status(200).json({
        simulations,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalItems: count,
      });
    } catch (error) {
      console.error("Erro ao listar simulações:", error);
      return res.status(500).json({ error: "Erro ao buscar simulações." });
    }
  }

  static async getSimulationById(req, res) {
    const { id } = req.params;

    try {
      const simulation = await Simulation.findOne({ where: { id } });

      if (!simulation) {
        return res.status(404).json({ error: "Simulação não encontrada." });
      }

      return res.status(200).json(simulation);
    } catch (error) {
      console.error("Erro ao buscar simulação:", error);
      return res.status(500).json({ error: "Erro ao buscar simulação." });
    }
  }

  static async getMetrics(req, res) {
    try {
      const where = {};
      if (!req.user.isAdmin) {
        where.user_id = req.user.id;
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const totalSimulations = await Simulation.count({ where });

      const monthlySimulations = await Simulation.count({
        where: {
          ...where,
          created_at: {
            [Op.gte]: startOfMonth,
          },
        },
      });

      const monthlyValue = await Simulation.sum("protectedValue", {
        where: {
          ...where,
          created_at: {
            [Op.gte]: startOfMonth,
          },
        },
      });

      const averageValue = await Simulation.findOne({
        where,
        attributes: [
          [sequelize.fn("AVG", sequelize.col("protectedValue")), "average"],
        ],
      });

      return res.status(200).json({
        total: totalSimulations,
        monthly: {
          count: monthlySimulations,
          value: monthlyValue || 0,
          average: averageValue.getDataValue("average") || 0,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
      return res.status(500).json({ error: "Erro ao buscar métricas." });
    }
  }

  static async updateSimulationById(req, res) {
    const { id } = req.params;
    const {
      vehicle_type_id,
      brand_id,
      model_id,
      year,
      price_table_id,
      protectedValue,
      plate,
      selectedProducts,
      plan_id,
      fipeValue,
      fipeCode,
      name,
      monthlyFee,
      implementList,
      discountedAccession,
      discountedAccessionCouponId,
      discountedMonthlyFee,
      discountedMonthlyFeeCouponId,
      discountedInstallationPrice,
      discountedInstallationPriceCouponId,
      valueSelectedProducts,
    } = req.body;

    try {
      const simulation = await Simulation.findOne({ where: { id } });

      if (!simulation) {
        return res.status(404).json({ error: "Simulação não encontrada." });
      }

      await simulation.update({
        fipeValue: fipeValue ?? null,
        fipeCode: fipeCode ?? null,
        name: name ?? null,
        vehicle_type_id: vehicle_type_id ?? simulation.vehicle_type_id,
        brand_id: brand_id ?? simulation.brand_id,
        model_id: model_id ?? simulation.model_id,
        year: year ?? simulation.year,
        price_table_id: price_table_id ?? simulation.price_table_id,
        protectedValue: protectedValue ?? simulation.protectedValue,
        plate: plate ?? simulation.plate,
        selectedProducts: Array.isArray(selectedProducts)
          ? selectedProducts
          : simulation.selectedProducts,
        plan_id: plan_id ?? simulation.plan_id,
        monthlyFee: monthlyFee ?? simulation.monthlyFee,
        implementList: Array.isArray(implementList)
          ? implementList
          : simulation.implementList,
        discountedAccession:
          discountedAccession ?? simulation.discountedAccession,
        discountedAccessionCouponId:
          discountedAccessionCouponId ?? simulation.discountedAccessionCouponId,
        discountedMonthlyFee:
          discountedMonthlyFee ?? simulation.discountedMonthlyFee,
        discountedMonthlyFeeCouponId:
          discountedMonthlyFeeCouponId ??
          simulation.discountedMonthlyFeeCouponId,
        discountedInstallationPrice:
          discountedInstallationPrice ?? simulation.discountedInstallationPrice,
        discountedInstallationPriceCouponId:
          discountedInstallationPriceCouponId ??
          simulation.discountedInstallationPriceCouponId,
        valueSelectedProducts:
          valueSelectedProducts ?? simulation.valueSelectedProducts,
      });

      return res.status(200).json(simulation);
    } catch (error) {
      console.error("Erro ao atualizar simulação:", error);
      return res.status(500).json({ error: "Erro ao atualizar simulação." });
    }
  }
}
