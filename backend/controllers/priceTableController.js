import PriceTable from "../models/PriceTable.js";
import VehicleCategory from "../models/VehicleCategory.js";

export default class PriceTableController {
  static async create(req, res) {
    const { name, category_id, ranges, plansSelected } = req.body;

    const nameExists = await PriceTable.findOne({ where: { name: name } });

    if (nameExists) {
      return res.status(422).json({
        message:
          "Tabela de Preços já cadastrada, por favor utilize outro nome!",
      });
    }

    const categoryExists = await VehicleCategory.findByPk(category_id);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Categoria de Veículo não encontrada!",
      });
    }

    try {
      const newTable = await PriceTable.create({ name, category_id, ranges, plansSelected });
      res.status(201).json(newTable);
    } catch (error) {
      console.error("Erro ao salvar tabela de preços:", error);
      res.status(500).json({ error: "Erro ao salvar." });
    }
  }

  static async getAll(req, res) {
    try {
      const priceTables = await PriceTable.findAll();
      return res.status(200).json({ priceTables: priceTables });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter as Tabelas de Preços.",
        error: error.message,
      });
    }
  }

  static async removePriceTableById(req, res) {
    const id = req.params.id;

    const priceTableExists = await PriceTable.findByPk(id);
    if (!priceTableExists) {
      res.status(404).json({ message: "Tabela de Preços não encontrada!" });
      return;
    }

    try {
      await PriceTable.destroy({ where: { id: id } });
      res
        .status(200)
        .json({ message: "Tabela de Preços removida com sucesso!" });
    } catch (error) {
      res.status(404).json({ message: "Tabela de Preços não encontrada!" });
      return;
    }
  }

  static async editPriceTable(req, res) {
    const id = req.params.id;
    const {name, ranges } = req.body;

    try {
      const table = await PriceTable.findByPk(id);
      if (!table)
        return res.status(404).json({ error: "Tabela não encontrada" });

      table.name = name;
      table.ranges = ranges;
      await table.save();

      res.json({ message: "Tabela atualizada com sucesso", table });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Tabela atualizada intervalos" });
    }
  }
}
