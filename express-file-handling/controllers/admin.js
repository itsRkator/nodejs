const fs = require("fs");
const { validationResult } = require("express-validator");

const Product = require("../models/Product");
const path = require("path");
const { deleteFile } = require("../utils/fileHandler");

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

const addProduct = (req, res, next) => {
  const { title, description, price } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage:
        "Invalid file, only image file is allowed including .jpg, .jpeg or .png extensions",
      validationErrors: [],
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: { title, description, price },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const imageUrl = image.path;

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
      // res.status(500).render("admin/edit-product", {
      //   pageTitle: "Add Product",
      //   path: "/admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   product: { title, imageUrl, description, price },
      //   errorMessage: "Something went wrong, please try again.",
      //   validationErrors: [],
      // });
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postEditProduct = (req, res, next) => {
  const { productId, title, price, description } = req.body;

  const image = req.file;

  // if (!image) {
  //   return res.status(422).render("admin/edit-product", {
  //     pageTitle: "Edit Product",
  //     path: "/admin/edit-product",
  //     editing: true,
  //     hasError: true,
  //     product: { title, price, description },
  //     errorMessage:
  //       "Invalid file, only image file is allowed including .jpg, .jpeg or .png extensions",
  //     validationErrors: [],
  //   });
  // }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: { title, description, price, _id: productId },
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
          product: { title, description, price, _id: productId },
          errorMessage: "You are not authorized to update product details.",
          validationErrors: [],
        });
      }
      product.title = title;
      product.price = price;

      if (image) {
        deleteFile(product.imageUrl);
        // deleteFile(path.join(__dirname, "..", product.imageUrl));
        product.imageUrl = image.path;
      }

      product.description = description;
      // product.userId = req.user._id;

      return product.save().then((result) => {
        console.log("Updated Product");
        res.redirect("/admin/products");
      });
    })

    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const deleteProduct = (req, res, next) => {
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found"));
      }
      deleteFile(product.imageUrl);
      // deleteFile(path.join(__dirname, "..", product.imageUrl));

      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then(() => {
      console.log("Deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
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
