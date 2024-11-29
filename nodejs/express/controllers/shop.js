const Product = require("../models/Product");

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      formsCss: false,
      productCss: true,
    });
  });
};

const getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      formsCss: false,
      productCss: true,
    });
  });
};

const getCart = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    formsCss: false,
    productCss: true,
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
    formsCss: false,
    productCss: true,
  });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    formsCss: false,
    productCss: false,
  });
};

module.exports = { getProducts, getIndex, getCart, getOrders, getCheckout };
