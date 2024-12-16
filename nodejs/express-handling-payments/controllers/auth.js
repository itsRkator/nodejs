const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const User = require("../models/User");

const mailer = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY, // To be replaced and used via environment variables
    },
  })
);

const getLogin = (req, res, next) => {
  const messages = req.flash("error");

  let messageText;

  if (messages.length > 0) {
    messageText = messages[0];
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: messageText,
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

const getSignup = (req, res, next) => {
  const messages = req.flash("error");

  let messageText;

  if (messages.length > 0) {
    messageText = messages[0];
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: messageText,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // req.flash(
        //   "error",
        //   "User doesn't exist, please provide correct email address."
        // );
        // return res.redirect("/login");

        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage:
            "User doesn't exist, please provide correct email address.",
          oldInput: { email, password },
          validationErrors: [{ path: "email" }],
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            // req.flash(
            //   "error",
            //   "Invalid password, please enter correct password."
            // );
            // return res.redirect("/login");

            return res.status(422).render("auth/login", {
              path: "/login",
              pageTitle: "Login",
              errorMessage: "Invalid password, please enter correct password.",
              oldInput: { email, password },
              validationErrors: [{ path: "password" }],
            });
          }

          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save();
        })
        .then((result) => {
          if (req.session.isLoggedIn) {
            res.redirect("/");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

// const postLogin = (req, res, next) => {
//   User.findById("674f2581dff1638be2de9830")
//     .then((user) => {
//       req.session.isLoggedIn = true;
//       req.session.user = user;
//       return req.session.save();
//     })
//     .then((result) => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       const error = new Error("Something went wrong, please try again.");
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

const postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return mailer.sendMail({
        from: "rohitashkmwt@gmail.com",
        to: email,
        subject: "Welcome to itsrkator.com",
        html: `
              <html>
                <body>
                  <h1>Welcome, Onboard!</h1>
                  <p>We're excited to have you on board. Thank you for signing up with us.</p>
                  <p>To get started, click the link below to explore our platform:</p>
                  <a href="http://localhost:3000">Get Started</a>
                  <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:support@itsrkator.com">support@itsrkator.com</a>.</p>
                  <p>Best regards,</p>
                  <p>Team itsRkator</p>
                </body>
              </html>
            `,
      });
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return;
    }
    res.redirect("/");
  });
};

const getReset = (req, res, next) => {
  const messages = req.flash("error");

  let messageText;

  if (messages.length > 0) {
    messageText = messages[0];
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: messageText,
  });
};

const postReset = (req, res, next) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash(
            "error",
            "Invalid data, No records found. Please check the email."
          );
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpirationDate = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return mailer.sendMail({
          from: "rohitashkmwt@gmail.com",
          to: email,
          subject: "Reset Your Password | itsRkator",
          html: `
            <html>
              <body>
                <h1>Password Reset Request</h1>
                <p>We received a request to reset your password. If you did not request a password reset, please ignore this email.</p>
                <p>To reset your password, click the link below:</p>
                <a href="http://localhost:3000/reset/${token}">Reset Password</a>
                <p>This link will expire in 24 hours for your security. If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:support@itsrkator.com">support@itsrkator.com</a>.</p>
                <p>Best regards,</p>
                <p>Team itsRkator</p>
              </body>
            </html>
          `,
        });
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        const error = new Error("Something went wrong, please try again.");
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

const getNewPassword = (req, res, next) => {
  const { token } = req.params;

  User.findOne({
    resetToken: token,
    resetTokenExpirationDate: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token is invalid or expired! Try again. ");
        return res.redirect("/reset");
      }
      const messages = req.flash("error");

      let messageText;

      if (messages.length > 0) {
        messageText = messages[0];
      }

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: messageText,
        userId: user._id.toString(),
        resetToken: token,
      });
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postNewPassword = (req, res, next) => {
  const { userId, resetToken, password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    req.flash("error", "Provide all required information.");
    return res.redirect("/reset");
  }

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match. Check again.");
    return res.redirect("/reset");
  }

  let existingUser;

  User.findOne({
    resetToken: resetToken,
    resetTokenExpirationDate: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      existingUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      existingUser.password = hashedPassword;
      existingUser.resetToken = undefined;
      existingUser.resetTokenExpirationDate = undefined;
      return existingUser.save();
    })
    .then((result) => {
      res.redirect("/");
      return mailer.sendMail({
        from: "rohitashkmwt@gmail.com",
        to: existingUser.email,
        subject: "Your password has been successfully updated!",
        html: `
          <html>
            <body>
              <h1>Password Updated Successfully</h1>
              <p>Hello,</p>
              <p>We are writing to inform you that the password has been successfully updated for your account associated with the email <a href="mailto:${existingUser.email}">${existingUser.email}</a>. If you did not make this change, please contact us immediately at <a href="mailto:support@itsrkator.com">support@itsrkator.com</a>.</p>
              <p>If this was you, you're all set! You can now use your new password to log in to your account.</p>
              <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:support@itsrkator.com">support@itsrkator.com</a>.</p>
              <p>Best regards,</p>
              <p>Team itsRkator</p>
            </body>
          </html>
        `,
      });
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

module.exports = {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};
