const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");

const {
  fileStorage,
  fileFilter,
  clearFile,
} = require("./src/utils/file-handler");
const graphqlSchema = require("./src/graphql/schema");
const graphqlResolver = require("./src/graphql/resolvers");
const { authorization } = require("./src/middlewares/authorization");

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

  // Since GraphQL never accept requests with method other than POST so manually handling OPTIONS method
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(authorization);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuthorized) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const imageFile = req.file;
  const { oldImageUrl } = req.body;

  if (!imageFile) {
    return res.status(200).json({ message: "No file provided!!" });
  }

  if (oldImageUrl) {
    const imagePath = path.join(__dirname, "src", oldImageUrl);
    clearFile(imagePath);
  }

  const imageUrl = path.join("images", imageFile.filename);
  return res
    .status(201)
    .json({ message: "File stored successfully!!", imageUrl });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || "An unexpected error occurred!!";
      const code = err.originalError.code || 500;

      return { message, data, status: code };
    },
  })
);

app.use((error, req, res, next) => {
  console.error("Error occurred: ", error);
  const status = error.statusCode || 500;
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
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database. Error: ", err);
  });
