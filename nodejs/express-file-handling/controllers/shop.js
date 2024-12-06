const fs = require("fs");
const path = require("path");

const pdfkit = require("pdfkit");

const Order = require("../models/Order");
const Product = require("../models/Product");

const getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      // console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
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

const getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: "Product",
        path: "/products",
        formsCss: false,
        productCss: false,
      });
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
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

const getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => user.cart.items)
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
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

const addToCart = (req, res, next) => {
  const { productId } = req.body;
  // console.log(req.user.constructor.name);

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;

  req.user
    .removeFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: { ...i.productId._doc },
      }));

      const order = new Order({
        user: {
          // name: req.user.name,
          email: req.user.email,
          userId: req.user._id,
        },
        products,
      });
      return order.save();
    })
    .then((result) => {
      // console.log("Before Clearing Cart: ", result);
      return req.user.clearCart();
    })
    .then((result) => {
      // console.log("After Clearing Cart: ", result);

      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        formsCss: false,
        productCss: true,
        orders,
      });
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getInvoice = (req, res, next) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        next(new Error("Invalid Order ID"));
      }
      // if (order.user.userId.toString() !== req.user._id.toString()) {
      //   return next(new Error("Unauthorized"));
      // }

      if (!order.user.userId.equals(req.user._id)) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      let totalPrice = 0;

      const invoicePdf = new pdfkit();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=${invoiceName}` // Opens in the browser tab
        // `attachment; filename=${invoiceName}` // Starts downloading
      );

      invoicePdf.pipe(fs.createWriteStream(invoicePath));
      invoicePdf.pipe(res);

      // Setting fonts and styles for the header
      invoicePdf
        .fontSize(30)
        .font("Helvetica-Bold")
        .text("Invoice", { underline: true, align: "center" });

      invoicePdf
        .moveDown(1)
        .fontSize(14)
        .font("Helvetica")
        .text(
          "----------------------------------------------------------------------------------------------------",
          {
            align: "center",
          }
        );

      invoicePdf.moveDown(2);

      // Customer & Invoice Information Section
      invoicePdf
        .fontSize(12)
        .text(`Invoice #: ${orderId}`, { continued: true })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });

      invoicePdf.moveDown(1);

      // Billing Address Section (Can be dynamic based on customer data)
      invoicePdf
        .fontSize(12)
        .text("Billing To:", { continued: true })
        .font("Helvetica-Bold")
        .text(" Mr. Rohitash Kator", { align: "left" });

      invoicePdf
        .font("Helvetica")
        .text("123 Street Address")
        .text("City, State ZIP")
        .moveDown(2);

      // Table header for product listing
      invoicePdf
        .font("Helvetica-Bold")
        .text("Name", 70, invoicePdf.y, { continued: true })
        .text("Price", 300, invoicePdf.y, { continued: true })
        .text("Quantity", 350, invoicePdf.y, { continued: true })
        .text("Total", 400, invoicePdf.y);

      invoicePdf
        // .moveDown(1)
        .font("Helvetica")
        .text(
          "---------------------------------------------------------------------------------------------------------------------",
          {
            align: "center",
          }
        );

      order.products.forEach((productDetails) => {
        totalPrice += productDetails.quantity * productDetails.product.price;

        invoicePdf
          .font("Helvetica")
          .text(`${productDetails.product.title}`, 70, invoicePdf.y, {
            continued: true,
          })
          .text(
            `${productDetails.product.price}`,
            300 - productDetails.product.price.toString().length,
            invoicePdf.y,
            { continued: true }
          )
          .text(
            `${productDetails.quantity}`,
            350 - productDetails.quantity.toString().length,
            invoicePdf.y,
            { continued: true }
          )
          .text(
            `$${productDetails.quantity * productDetails.product.price}`,
            400 -
              (
                productDetails.quantity * productDetails.product.price
              ).toString().length,
            invoicePdf.y
          );
      });

      invoicePdf
        .font("Helvetica-Bold")
        .text(
          "---------------------------------------------------------------------------------------------------------------------",
          {
            align: "center",
          }
        )
        .text(`Total Price: $${totalPrice.toFixed(2)}`, { align: "right" });

      // Footer with contact info or additional notes
      invoicePdf
        .moveDown(1)
        .fontSize(10)
        .font("Helvetica")
        .text("Thank you for your business!", { align: "center" })
        .text("For any inquiries, contact us at support@company.com", {
          align: "center",
        });

      invoicePdf.end();

      // fs.readFile(invoicePath, (err, invoiceData) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `attachment; filename=${invoiceName}`
      //   );
      //   res.send(invoiceData);
      // });

      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   `inline; filename=${invoiceName}` // Opens in the browser tab
      //   // `attachment; filename=${invoiceName}` // Starts downloading
      // );

      // file.pipe(res);
    })
    .catch((err) => {
      const error = new Error("Something went wrong, please try again.");
      error.httpStatusCode = 500;
      return next(error);
    });
};

// const getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     pageTitle: "Checkout",
//     path: "/checkout",
//     formsCss: false,
//     productCss: false,
//   });
// };

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCartDeleteProduct,
  addToCart,
  postOrder,
  getOrders,
  getInvoice,
  // getCheckout,
};
