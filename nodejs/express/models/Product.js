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

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0; // Random number between 0 and 15
    const v = c === "x" ? r : (r & 0x3) | 0x8; // Set the variant (4 and y)
    return v.toString(16); // Convert to hexadecimal
  });
};

class Product {
  constructor(title, imageUrl, description, price) {
    this.id = generateUUID();
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
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
