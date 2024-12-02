const Product = require("../models/product");

const addProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;

  req.user
    .createProduct({ title, imageUrl, description, price })
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
    });
};

const getProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }
  const { productId } = req.params;

  req.user
    .getProducts({ where: { id: productId } })
    // Product.findByPk(productId)
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        formsCss: false,
        productCss: true,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      return product.save();
    })
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
    });
};

const deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("Destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  addProduct,
  getProduct,
  getEditProduct,
  getProducts,
  postEditProduct,
  deleteProduct,
};
