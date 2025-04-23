function getToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  const token = authHeader.split(" ");
  if (token.length !== 2) {
    return null;
  }
  return token[1];
}

export default getToken;


