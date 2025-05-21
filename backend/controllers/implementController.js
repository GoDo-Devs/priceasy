import Implement from "../models/Implement.js";

export default class ImplementController {
  static async create(req, res) {
    const { name, price } = req.body;

    const implementExists = await Implement.findOne({ where: { name } });

    if (implementExists) {
      return res.status(422).json({
        message: "Implemento já cadastrado, por favor utilize outro nome!",
      });
    }

    try {
      const newImplement = await Implement.create({
        name: name.trim(),
        price: Number(price),
      });

      return res.status(200).json({
        message: "Implemento criado com sucesso!",
        product: newImplement,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar o Implemento.",
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    const implementsList = await Implement.findAll();

    try {
      res.status(200).json({ implementsList: implementsList });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar implementos.", error: error.message });
    }
  }

  static async removeImplementById(req, res) {
    const id = req.params.id;

    const implementById = await Implement.findByPk(id);

    if (!implementById) {
      res.status(404).json({ message: "Implemento não encontrado!" });
      return;
    }

    try {
      await Product.destroy({ where: { id: id } });
      res.status(200).json({ message: "Implemento removido com sucesso!" });
      return;
    } catch (error) {
      res.status(404).json({ message: "Implemento não encontrado!" });
      return;
    }
  }
}
