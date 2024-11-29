const express = require("express");
const path = require("path");

const { products } = require("./admin");

const rootDir = require("../utils/rootPath");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    formsCss: false,
    productCss: true,
  });
});

module.exports = router;
