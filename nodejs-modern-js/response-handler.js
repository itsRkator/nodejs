import fs from "fs/promises";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const responseHandler = (req, res, next) => {
  fs.readFile("index.html", "utf-8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
    });
  //   res.sendFile(path.join(__dirname, "index.html"));
};

// export { responseHandler };
