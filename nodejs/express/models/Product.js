const rootPath = require("../utils/rootPath");
const Cart = require("./Cart");
const db = require("../utils/database");

// const filePath = path.join(rootPath, "data", "products.json");

// const readProductsFromJson = (cb) => {
//   fs.readFile(filePath, (err, fileContent) => {
//     if (err) {
//       console.error(err);
//       return cb([]);
//     }
//     cb(JSON.parse(fileContent));
//   });
// };

// const generateUUID = () => {
//   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//     const r = (Math.random() * 16) | 0; // Random number between 0 and 15
//     const v = c === "x" ? r : (r & 0x3) | 0x8; // Set the variant (4 and y)
//     return v.toString(16); // Convert to hexadecimal
//   });
// };

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES(?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  }

  static deleteById(id) {}
}

module.exports = Product;
