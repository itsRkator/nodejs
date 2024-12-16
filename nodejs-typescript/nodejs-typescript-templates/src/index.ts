import express from "express";
import bodyParser from "body-parser";

import todosRouters from "./routes/todos";

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(todosRouters);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
