const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/User");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { mongoConnect, getDb } = require("./utils/database");

const { notFoundError } = require("./controllers/error");

const app = express();

// Using Pug
// app.set("view engine", "pug");
// app.set("views", "views");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findUserById("674e11b379c0222287a3bfb2")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(notFoundError);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
