import User from "../models/User.js";

export default class UserController {
  static async getAll(req, res) {
    try {
      const users = await User.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Grupo de Produtos.",
        error: error.message,
      });
    }
  }

  static async removeUserById(req, res) {
    const id = req.params.id;

    const userExists = await User.findByPk(id);
    if (!userExists) {
      res.status(404).json({ message: "Usuário não encontrado!" });
      return;
    }

    try {
      await User.destroy({ where: { id: id } });
      res.status(404).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
      res.status(404).json({ message: "Usuário não encontrado!" });
      return;
    }
  }
}
