import ProductGroup from "../models/ProductGroup.js";

export default class ProductGroupController {
  static async getAll(req, res) {
    try {
      const productsGroups = await ProductGroup.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ productsGroups});
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Grupo de Produtos.",
        error: error.message,
      });
    }
  }

  static async removeProductGroupById(req, res) {
    const id = req.params.id

    const groupExists = await ProductGroup.findByPk(id)
    if(!groupExists) {
      res.status(404).json({ message: "Grupo de Produtos não encontrado!" });
      return;
    }

    try {
      await ProductGroup.destroy({ where: { id: id } });
      res.status(404).json({ message: "Grupo de Produtos removido com sucesso!" });
    } catch (error) {
      res.status(404).json({ message: "Grupo de Produtos não encontrado!" });
      return;
    }
  }
}
