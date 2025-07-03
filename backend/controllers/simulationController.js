import Simulation from "../models/Simulation.js";

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
        selectedProducts,
        plan_id,
        monthlyFee,
        implementList,
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
        vehicle_type_id: vehicle_type_id ?? null,
        brand_id: brand_id ?? null,
        model_id: model_id ?? null,
        year: year ?? null,
        price_table_id: price_table_id ?? null,
        protectedValue: protectedValue ?? null,
        selectedProducts: Array.isArray(selectedProducts)
          ? selectedProducts
          : [],
        plan_id: plan_id ?? null,
        monthlyFee: monthlyFee ?? null,
        implementList: Array.isArray(implementList) ? implementList : [],
      });

      return res.status(201).json(simulation);
    } catch (error) {
      console.error("Erro ao criar simulação:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  static async getAllSimulations(req, res) {
    try {
      const simulations = await Simulation.findAll({
        order: [["created_at", "DESC"]],
      });

      return res.status(200).json(simulations);
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
}
