const express = require("express");

const {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCartDeleteProduct,
  addToCart,
  postOrder,
  getOrders,
  getInvoice,
  // getCheckout,
} = require("../controllers/shop");
const { isAuthenticated } = require("../middleware/is-auth");

const router = express.Router();

router.get("/", getIndex);
router.get("/products", getProducts);
router.get("/products/:productId", getProduct);
router.get("/cart", isAuthenticated, getCart);
router.post("/cart-delete-item", isAuthenticated, postCartDeleteProduct);
router.post("/cart", isAuthenticated, addToCart);
router.post("/create-order", isAuthenticated, postOrder);
router.get("/orders", isAuthenticated, getOrders);
router.get("/orders/:orderId", isAuthenticated, getInvoice);
// router.get("/checkout", getCheckout);

module.exports = router;
