const express = require("express");
const path = require("path");

const { getProduct, addProduct, getProducts } = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", getProduct);
router.get("/products", getProducts);
router.post("/add-product", addProduct);

module.exports = router;

// exports = router;
// exports = products;
