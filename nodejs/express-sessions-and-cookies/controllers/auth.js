const User = require("../models/User");

const getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split(";")[1].split("=")[1].trim() === "true";

  console.log(req.session);
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

const postLogin = (req, res, next) => {
  User.findById("674f2581dff1638be2de9830")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
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

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return;
    }
    res.redirect("/");
  });
};
module.exports = { getLogin, postLogin, postLogout };
