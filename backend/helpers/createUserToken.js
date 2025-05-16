import jwt from "jsonwebtoken";

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user.id,
    },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    message: "Usuário criado com sucesso!",
    token: token,
    userId: user.id,
  });
};

export default createUserToken;
