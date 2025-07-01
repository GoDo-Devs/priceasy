import User from "../models/User.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

import createUserToken from "../helpers/createUserToken.js";
import getToken from "../helpers/getToken.js";
import getUserByToken from "../helpers/getUserByToken.js";

export default class AuthController {
  static async register(req, res) {
    const { name, email, password, confirmpassword, is_admin } = req.body;

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: "A senha e a confirmação precisam ser iguais!" });
      return;
    }

    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      res.status(422).json({ message: "E-mail já cadastrado!" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      const user = await User.create({
        name: name.trim(),
        email: email.trim(),
        password: passwordHash,
        is_admin: is_admin,
      });

      res.status(201).json({
        message: "Usuário criado com sucesso!",
        user: user,
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "Senha inválida!" });
      return;
    }

    const token = await createUserToken(user, req, res);

    user.password = undefined;

    res.status(200).json({
      message: "Você está autenticado",
      token: token,
      user: user,
    });
  }

  static async checkUser(req, res) {
    const user = req.user;

    res.status(200).json({ user });
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado" });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const token = getToken(req);
    const loggedUser = await getUserByToken(token);
    const userIdToEdit = req.params.id;

    const { name, email, password, is_admin } = req.body;

    try {
      if (loggedUser.id !== userIdToEdit && !loggedUser.is_admin) {
        return res.status(403).json({ message: "Acesso negado!" });
      }

      const user = await User.findByPk(userIdToEdit);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      const userExists = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userIdToEdit },
        },
      });

      if (userExists) {
        return res
          .status(422)
          .json({ message: "Por favor, utilize outro e-mail!" });
      }

      user.name = name;
      user.email = email;
      user.is_admin = is_admin;

      if (password) {
        if (password.length < 6) {
          return res
            .status(422)
            .json({ message: "A senha deve ter no mínimo 6 caracteres." });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
      }

      await user.save();

      return res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        data: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
  }
}
