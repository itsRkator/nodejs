import express from "express";
import { responseHandler } from "./response-handler.js";

const app = express();

app.get("/", responseHandler);

app.listen(3000, () => {
  console.log("Server is running!!!");
});
