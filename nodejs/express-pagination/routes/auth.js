const express = require("express");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");

const {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/login", getLogin);
router.get("/signup", getSignup);
router.post(
  "/login",
  [
    check("email", "Enter a valid email address.")
      .notEmpty()
      .isEmail()
      .normalizeEmail(),
    body(
      "password",
      "Invalid password, password must be alphanumeric and at lease 6 characters long."
    )
      .notEmpty()
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
  ],
  postLogin
);
router.post(
  "/signup",
  [
    check("email", "Enter a valid email.")
      .notEmpty()
      .isEmail()
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address is forbidden");
        // }
        // return true;

        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email already exists, choose a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 6 characters long."
    )
      .notEmpty()
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .notEmpty()
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password do not match, check again!!");
        }
        return true;
      }),
  ],
  postSignup
);
router.post("/logout", postLogout);
router.get("/reset", getReset);
router.post("/reset", postReset);
router.get("/reset/:token", getNewPassword);
router.post("/new-password", postNewPassword);

module.exports = router;
