import jwt from "jsonwebtoken";
import getToken from "../helpers/getToken.js";
import User from "../models/User.js";

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const jwtUser = jwt.verify(token, process.env.JWT_SECRET);
    User.findByPk(jwtUser.id, {
      attributes: { exclude: ["password"] },
    }).then((data) => {
      if (!data) {
        return res.status(400).json("Usuário não encontrado");
      }

      req.user = data.dataValues

      next();
    });
  } catch (err) {
    return res.status(400).json({ message: "Token inválido!" });
  }
};

export default checkToken;
