import Plan from "../models/Plan.js";
import Service from "../models/Service.js";
import PlanService from "../models/PlanService.js";
import isValidArray from "../helpers/isValidArray.js";

export default class PlanController {
  static async create(req, res) {
    const { name, price, services_id } = req.body;

    const planExists = await Plan.findOne({ where: { name } });
    if (planExists) {
      return res.status(422).json({
        message: "Plano já cadastrado, por favor utilize outro nome!",
      });
    }

    try {
      const validIds = await isValidArray(services_id, Service, req, res);

      const newPlan = await Plan.create({
        name: name.trim(),
        price: Number(price),
      });

      if (validIds.length > 0) {
        const values = validIds.map((id) => ({
          service_id: id,
          plan_id: newPlan.id,
        }));

        await PlanService.bulkCreate(values);
      }

      return res.status(200).json({
        message: "Plano criado com sucesso!",
        product: newPlan,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar o Plano.",
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const plans = await Plan.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ plans });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Planos.",
        error: error.message,
      });
    }
  }

  static async removePlanById(req, res) {
    const id = req.params.id;

    const planById = await Plan.findByPk(id);

    if (!planById) {
      res.status(404).json({ message: "Plano não encontrado!" });
      return;
    }

    try {
      await Plan.destroy({ where: { id: id } });
      res.status(200).json({ message: "Plano removido com sucesso!" });
      return;
    } catch (error) {
      res.status(404).json({ message: "Plano não encontrado!" });
      return;
    }
  }
}
