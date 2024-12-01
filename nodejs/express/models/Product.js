const fs = require("fs");
const path = require("path");
const rootPath = require("../utils/rootPath");
const Cart = require("./Cart");

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
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    readProductsFromJson((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (p) => p.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Product Updated!!");
          }
        });
      } else {
        this.id = generateUUID();
        products.push(this);
        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Product saved!!");
          }
        });
      }
    });
  }

  static fetchAll(cb) {
    readProductsFromJson(cb);
  }

  static findById(id, cb) {
    readProductsFromJson((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  static deleteById(id) {
    readProductsFromJson((products) => {
      const product = products.find((p) => p.id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(filePath, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }
}

module.exports = Product;
