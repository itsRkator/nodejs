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
const { isAuthenticated } = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuthenticated, getProduct);
router.get("/products", isAuthenticated, getProducts);
router.post("/add-product", isAuthenticated, addProduct);
router.get("/edit-product/:productId", isAuthenticated, getEditProduct);
router.post("/edit-product", isAuthenticated, postEditProduct);
router.post("/delete-product", isAuthenticated, deleteProduct);

module.exports = router;

// exports = router;
// exports = products;
