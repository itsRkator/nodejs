const jwt = require("jsonwebtoken");

// const JWT_SECRET = "REPLACE_WITH_YOUR_JWT_SECRET"; // To be fetched from env variables
const JWT_SECRET =
  "f943e389b3f0deae479a37eeb67dce6c9ccb633f722354545ad7864216cce395dfc0a72f6ab5e3ccc3afea35709631af2db9abb9123db8455e0d614ec31bb2b1"; // To be fetched from env variables

const authorization = (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  if (!authorizationHeader) {
    req.isAuthorized = false;
    return next();
  }

  const token = authorizationHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    req.isAuthorized = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuthorized = false;
    return next();
  }

  req.userId = decodedToken.userId;
  req.email = decodedToken.email;
  req.isAuthorized = true;

  next();
};

module.exports = { authorization };
