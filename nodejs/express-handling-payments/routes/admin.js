const express = require("express");
const { body } = require("express-validator");

const {
  getProduct,
  addProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");
const { isAuthenticated } = require("../middleware/is-auth");
const Product = require("../models/Product");

const router = express.Router();

router.get("/add-product", isAuthenticated, getProduct);
router.get("/products", isAuthenticated, getProducts);
router.post(
  "/add-product",
  [
    body("title", "Title must be at lease 3 character long.")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    // body("imageUrl", "Invalid image url, please check again.").isURL(),
    body("price", "Price must be a number.").isFloat(),
    body(
      "description",
      "Description must have at least 6 characters and at most 500 characters."
    )
      .isLength({ min: 6, max: 500 })
      .trim(),
  ],
  isAuthenticated,
  addProduct
);
router.get("/edit-product/:productId", isAuthenticated, getEditProduct);
router.post(
  "/edit-product",
  [
    body("title", "Title must be at lease 3 character long.")
      .trim()
      .isString()
      .isLength({ min: 3 }),
    // body("imageUrl", "Invalid image url, please check again.").isURL(),
    body("price", "Price must be a number.").isFloat(),
    body(
      "description",
      "Description must have at least 6 characters and at most 500 characters."
    )
      .isLength({ min: 6, max: 500 })
      .trim(),
  ],
  isAuthenticated,
  postEditProduct
);
// router.post("/delete-product", isAuthenticated, deleteProduct);
router.delete("/product/:productId", isAuthenticated, deleteProduct)

module.exports = router;

// exports = router;
// exports = products;
