import Client from "../models/Client.js";

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

  static async getAll(req, res) {
    try {
      const clients = await Client.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ clients });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os Clientes.",
        error: error.message,
      });
    }
  }
}
