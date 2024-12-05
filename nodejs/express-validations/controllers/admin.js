const { validationResult } = require("express-validator");

const Product = require("../models/Product");

const addProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: { title, imageUrl, description, price },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  });
  product
    .save()
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
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const { productId } = req.params;

  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId", "name")
    .then((products) => {
      // console.log(products);
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: { title, imageUrl, description, price, _id: productId },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.status(422).render("admin/edit-product", {
          pageTitle: "Edit Product",
          path: "/admin/edit-product",
          editing: true,
          hasError: true,
          product: { title, imageUrl, description, price, _id: productId },
          errorMessage: "You are not authorized to update product details.",
          validationErrors: [],
        });
      }
      product.title = title;
      product.price = price;
      product.imageUrl = imageUrl;
      product.description = description;
      // product.userId = req.user._id;
      return product.save().then((result) => {
        console.log("Updated Product");
        res.redirect("/admin/products");
      });
    })

    .catch((err) => {
      console.error(err);
    });
};

const deleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      console.log("Deleted");
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
