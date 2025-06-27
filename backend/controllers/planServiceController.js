import PlanService from "../models/PlanService.js";
import Service from "../models/Service.js";

export default class PlanServiceController {
  static async getAll(req, res) {
    try {
      const planServices = await PlanService.findAll({});
      return res.status(200).json({ planServices });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Planos.",
        error: error.message,
      });
    }
  }

  static async getServicesByPlanId(req, res) {
    const id = req.params.id;

    try {
      const planServices = await PlanService.findAll({
        where: { plan_id: id },
        attributes: ["service_id"],
      });

      if (!planServices || planServices.length === 0) {
        return res.status(422).json({
          message: "Serviços não encontrados!",
        });
      }

      const serviceIds = planServices.map((ps) => ps.service_id);

      const services = await Service.findAll({
        where: { id: serviceIds },
        attributes: ["id", "name"],
      });

      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os serviços do plano.",
        error: error.message,
      });
    }
  }
}
