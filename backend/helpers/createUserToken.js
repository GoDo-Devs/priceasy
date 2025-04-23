import jwt from "jsonwebtoken";

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user.id,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    message: "Você está autenticado",
    token: token,
    userId: user.id,
  });
};

export default createUserToken;
