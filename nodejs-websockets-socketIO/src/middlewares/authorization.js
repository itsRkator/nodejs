const jwt = require("jsonwebtoken");

const JWT_SECRET = "REPLACE_WITH_YOUR_JWT_SECRET"; // To be fetched from env variables

const isAuthorized = (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  if (!authorizationHeader) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const token = authorizationHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  req.email = decodedToken.email;
  next();
};

module.exports = { isAuthorized };
