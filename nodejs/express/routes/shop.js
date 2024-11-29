const express = require("express");
const path = require("path");

const { products } = require("./admin");

const rootDir = require("../utils/rootPath");
const { getProducts } = require("../controllers/products");

const router = express.Router();

router.get("/", getProducts);

module.exports = router;
