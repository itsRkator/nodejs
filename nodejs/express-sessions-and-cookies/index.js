const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/User");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const { notFoundError } = require("./controllers/error");

const MONGODB_URI =
  "MONGO_URI"; // To be Replaced with actual MongoDB URI using string or environment variable

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// Using Pug
// app.set("view engine", "pug");
// app.set("views", "views");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret:
      "a9b52d9e528a1a124f597104cc562ef86d030ddee39f8c9ef5819c1d06cc981e1cd1e4cfd13b34a96e2f1f1cf6a1abf883dbb2dcd9d39b3bb8b67f4a8763329", // To be funneled through the environment variables
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(notFoundError);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User.findOne().then((existingUser) => {
      // console.log("Existing user", existingUser);
      if (!existingUser) {
        const user = new User({
          name: "Rohitash Kator",
          email: "rohitashkmwt@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    console.log("Connected to the Database!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
