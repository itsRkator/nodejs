const express = require("express");
const path = require("path");

const rootDir = require("../utils/rootPath");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCss: true,
    productCss: true,
  });
});

router.post("/add-product", (req, res, next) => {
  const { title } = req.body;
  products.push({ title });
  res.redirect("/");
});

module.exports = { adminRoutes: router, products };

// exports = router;
// exports = products;
