const express = require("express");
const { body } = require("express-validator");

const User = require("../models/User");
const { isAuthorized } = require("../middlewares/authorization");
const {
  signup,
  login,
  getUserStatus,
  updateUserStatus,
} = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email", "Invalid email address, please check.")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists!!");
          }
          return true;
        });
      })
      .normalizeEmail(),
    body("password", "Invalid password, must be at least 6 character long")
      .trim()
      .isLength({ min: 6 }),
    body("confirmPassword").custom((value, { req }) => {
      console.log(value, req.body.password);
      if (value !== req.body.password) {
        return Promise.reject("Password do not match, please verify.");
      }
      return true;
    }),
    body("name").trim().not().isEmpty(),
  ],
  signup
);

router.post("/login", login);

router.get("/status", isAuthorized, getUserStatus);
router.patch(
  "/status",
  isAuthorized,
  [body("status").trim().not().isEmpty()],
  updateUserStatus
);

module.exports = router;
