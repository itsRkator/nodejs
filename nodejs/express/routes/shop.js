const express = require("express");

const {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCartDeleteProduct,
  addToCart,
  getOrders,
  getCheckout,
} = require("../controllers/shop");

const router = express.Router();

router.get("/", getIndex);
router.get("/products/:productId", getProduct);
router.get("/products", getProducts);
router.get("/cart", getCart);
router.post("/cart-delete-item", postCartDeleteProduct);
router.post("/cart", addToCart);
router.get("/orders", getOrders);
router.get("/checkout", getCheckout);

module.exports = router;
