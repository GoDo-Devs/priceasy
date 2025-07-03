import Client from "../models/Client.js";
import { Op } from "sequelize";

export default class ClientController {
  static async create(req, res) {
    const { name, cpf, phone } = req.body;

    const clientExists = await Client.findOne({ where: { cpf } });

    if (clientExists) {
      return res.status(422).json({
        message: "Cliente já cadastrado, por favor utilize outro CPF!",
      });
    }

    try {
      const newClient = await Client.create({
        name,
        cpf,
        phone,
      });

      const clientData = await Client.findOne({
        where: { id: newClient.id },
        attributes: { exclude: ["cpf"] },
      });

      return res.status(200).json({
        message: "Cliente criado com sucesso!",
        client: clientData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar o Cliente.",
        error: error.message,
      });
    }
  }

  static async getClientById(req, res) {
    const id = req.params.id;

    const clientById = await Client.findByPk(id);

    if (!clientById) {
      res.status(404).json({ message: "Cliente não encontrado!" });
      return;
    }

    try {
      const client = await Client.findByPk(id);
      res.status(200).json(client);
    } catch (error) {
      res.status(404).json({ message: "Cliente não encontrado!" });
      return;
    }
  }

  static async getAll(req, res) {
    try {
      const clients = await Client.findAll({
        attributes: { exclude: ["cpf"] },
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ clients: clients });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Clientes.",
        error: error.message,
      });
    }
  }

  static async getByCpf(req, res) {
    const { cpf } = req.body;

    try {
      const client = await Client.findOne({
        where: { cpf },
      });

      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado." });
      }

      return res.status(200).json(client);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar o Cliente.",
        error: error.message,
      });
    }
  }

  static async searchCpfs(req, res) {
    const { cpf } = req.body;

    try {
      const clients = await Client.findAll({
        where: {
          cpf: {
            [Op.like]: `%${cpf}%`,
          },
        },
        attributes: ["cpf"],
        limit: 10,
      });

      return res.status(200).json(clients);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar CPFs.",
        error: error.message,
      });
    }
  }
}
