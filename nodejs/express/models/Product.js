const fs = require("fs");
const path = require("path");
const rootPath = require("../utils/rootPath");

const filePath = path.join(rootPath, "data", "products.json");

const readProductsFromJson = (cb) => {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      console.error(err);
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    readProductsFromJson((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log("Product saved!!");
        }
      });
    });
  }

  static fetchAll(cb) {
    readProductsFromJson(cb);
  }
}

module.exports = Product;
