const notFoundError = (req, res, next) => {
  res.render("404", {
    pageTitle: "404 - Not Found!",
    path: "/error-page",
    formsCss: false,
    productCss: false,
  });
};

const internalServerError = (req, res, next) => {
  res.render("500", {
    pageTitle: "500 - Server Error!",
    path: "/server-error",
    formsCss: false,
    productCss: false,
  });
};

module.exports = { notFoundError, internalServerError };
