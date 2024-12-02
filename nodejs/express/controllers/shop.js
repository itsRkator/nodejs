const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldInfo]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
        formsCss: false,
        productCss: true,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(([products]) => {
      res.render("shop/product-details", {
        product: products[0],
        pageTitle: "Product",
        path: "/products",
        formsCss: false,
        productCss: false,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
        formsCss: false,
        productCss: true,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const getCart = (req, res, next) => {
  Cart.getCartProducts((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find((p) => p.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts,
        formsCss: false,
        productCss: true,
      });
    });
  });
};

const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
};

const addToCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
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

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCartDeleteProduct,
  addToCart,
  getOrders,
  getCheckout,
};
