import Service from "../models/Service.js";
import Category from "../models/Category.js";

export default class ServiceController {
  static async create(req, res) {
    const { name, category_id } = req.body;

    const serviceExists = await Service.findOne({ where: { name } });
    if (serviceExists) {
      return res.status(422).json({
        message: "Serviço já cadastrado, por favor utilize outro nome!",
      });
    }

    const existingCategory = await Category.findByPk(category_id);
    if (!existingCategory) {
      return res.status(400).json({
        message:
          "Categoria não encontrada, por favor utilize uma categoria existente!",
      });
    }

    try {
      const newService = await Service.create({
        name: name.trim(),
        category_id: existingCategory.id,
      });

      return res.status(200).json({
        message: "Serviço criado com sucesso!",
        product: newService,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar o Serviço.",
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
     try {
      const services = await Service.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ services});
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Serviços.",
        error: error.message,
      });
    }
  }

  static async removeServiceById(req, res) {
    const id = req.params.id;

    const implementById = await Service.findByPk(id);

    if (!implementById) {
      res.status(404).json({ message: "Serviço não encontrado!" });
      return;
    }

    try {
      await Service.destroy({ where: { id: id } });
      res.status(200).json({ message: "Serviço removido com sucesso!" });
      return;
    } catch (error) {
      res.status(404).json({ message: "Serviço não encontrado!" });
      return;
    }
  }

}
