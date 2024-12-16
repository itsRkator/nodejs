const express = require("express");
const path = require("path");

const {
  getProduct,
  addProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", getProduct);
router.get("/products", getProducts);
router.post("/add-product", addProduct);
router.get("/edit-product/:productId", getEditProduct);
router.post("/edit-product", postEditProduct);
router.post("/delete-product", deleteProduct);

module.exports = router;

// exports = router;
// exports = products;
