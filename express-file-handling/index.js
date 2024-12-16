const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSession = require("connect-mongodb-session");
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const User = require("./models/User");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const MongoDBStore = mongoSession(session);

const { notFoundError, internalServerError } = require("./controllers/error");

const MONGODB_URI = "MONGO_URI"; // To be Replaced with actual MongoDB URI using string or environment variable

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = path.join(__dirname, "images");

    // Check if directory exists, if not create it
    fs.exists(dirPath, (exists) => {
      if (!exists) {
        fs.mkdirSync(dirPath); // create the directory
      }
      cb(null, "images"); // Use the directory path
    });
  },
  filename: (req, file, cb) => {
    // if (
    //   file.mimetype === "image/png" ||
    //   file.mimetype === "image/jpg" ||
    //   file.mimetype === "image/jpeg"
    // ) {
    //   cb(null, `${new Date().toISOString()}_${file.originalname}`);
    // } else {
    //   cb(new Error("Invalid file type"), false);
    // }

    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    // cb(new Error("Invalid file type"), false);
  }
};

// Using Pug
// app.set("view engine", "pug");
// app.set("views", "views");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "SESSION_SECRET", // To be funneled through the environment variables
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/server-error", internalServerError);
app.use(notFoundError);

app.use((err, req, res, next) => {
  // console.log("Error", err);
  // res.redirect("/server-error");
  res.render("500", {
    pageTitle: "500 - Server Error!",
    path: "/server-error",
    formsCss: false,
    productCss: false,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("Connected to the Database!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Database. Error: ", err);
  });
