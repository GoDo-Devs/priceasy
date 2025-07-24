import User from "../models/User.js";
import { Op } from "sequelize";

export default class UserController {
  static async getAll(req, res) {
    try {
      const users = await User.findAll({
        where: {
          email: {
            [Op.not]: "admin@gmail.com",
          },
        },
        order: [["name", "ASC"]],
      });

      return res.status(200).json({ users });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Usuários.",
        error: error.message,
      });
    }
  }
  static async getUserById(req, res) {
    const { id } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado!" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar usuário.",
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
      res.status(200).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
      res.status(404).json({ message: "Usuário não encontrado!" });
      return;
    }
  }
}
