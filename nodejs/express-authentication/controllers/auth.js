const bcrypt = require("bcryptjs");

const User = require("../models/User");

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
  });
};

const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
          }

          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            if (err) {
              console.error(err);
              return;
            }
            res.redirect("/");
          });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
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
//       console.error(err);
//     });
// };

const postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    req.flash("error", "Please provide required information.");
    return res.redirect("/signup");
  }
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match. Check again.");
    return res.redirect("/signup");
  }

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists, choose a different one.");
        return res.redirect("/signup");
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
        });
    })
    .catch((err) => {
      console.error(err);
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
module.exports = { getLogin, getSignup, postLogin, postSignup, postLogout };
