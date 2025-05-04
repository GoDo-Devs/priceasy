import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import createUserToken from "../helpers/createUserToken.js";
import getToken from "../helpers/getToken.js";
import getUserByToken from "../helpers/getUserByToken.js";

export default class AuthController {
  // register
  static async register(req, res) {

    const {name, email, password, confirmpassword} = req.body

    if (password != confirmpassword) {
      res
        .status(422)
        .json({ message: 'A senha e a confirmação precisam ser iguais!' })
      return
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e=mail!" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name: name,
      email: email,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // login
  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: "Usuário não encontrado!" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "Senha inválida!" });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    const user = req.user;
    res.status(200).json({user});
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
    const user = await getUserByToken(token);

    const { name, email, password, confirmpassword } = req.body;


    const userExists = await User.findOne({ where: { email } });

    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Por favor, utilize outro e-mail!" });
      return;
    }

    try {
      user.name = name;
      user.email = email;

      if (password && password === confirmpassword) {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
      }

      await user.save();

      res.status(200).json({
        message: "Usuário atualizado com sucesso!",
        data: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }
}
