const express = require("express");
const path = require("path");

const rootDir = require("../utils/rootPath");
const { getProduct, addProduct } = require("../controllers/products");

const router = express.Router();

router.get("/add-product", getProduct);

router.post("/add-product", addProduct);

module.exports = router;

// exports = router;
// exports = products;
