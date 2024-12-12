const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const authRoutes = require("./src/routes/auth");
const feedRoutes = require("./src/routes/feed");

const { fileStorage, fileFilter } = require("./src/utils/file-handler");

const MONGODB_URI = "MONGO_URI"; // To be Replaced with actual MongoDB URI using string or environment variable

const app = express();

app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "src", "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.error("Error occurred: ", error);
  const status = error.statusCode;
  const message = error.message;
  const errors = error.errors;

  res.status(status).json({
    message,
    errors,
  });
});

const PORT = process.env.PORT || 8080;

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("Connected to the database.");
    const server = app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
    const socketIO = require("./socket");
    const websocket = socketIO.initializeWebSocket(server);

    websocket.on("connection", (socket) => {
      console.log(`Client Connected to the websocket`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database. Error: ", err);
  });
