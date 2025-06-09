import PlanService from "../models/PlanService.js";

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
      const servicesByPlanId = await PlanService.findAll({
        where: { plan_id: id },
      });

      if (!servicesByPlanId) {
        return res.status(422).json({
          message: "Serviços não encontrados!",
        });
      }

      const serviceIds = servicesByPlanId.map((s) => s.service_id);

      return res.status(200).json(serviceIds);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os serviços do plano.",
        error: error.message,
      });
    }
  }
}
