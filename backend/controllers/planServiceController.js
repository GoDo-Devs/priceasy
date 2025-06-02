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
}
