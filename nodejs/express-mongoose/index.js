const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/User");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

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
  User.findById("674ec2fd32ba93ba8d9f5508")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(notFoundError);

mongoose
  .connect(
    "mongodb+srv://itsrkator:Z0351$AlPhA@mongo-cluster.ostez.mongodb.net/node_mongoose?retryWrites=true&w=majority&appName=mongo-cluster"
  )
  .then(() => {
    User.findOne().then((existingUser) => {
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
    console.log("Connected to the Database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
