const notFoundError = (req, res, next) => {
  res.render("404", {
    pageTitle: "404 - Not Found",
    path: "/error-page",
    formsCss: false,
    productCss: false,
  });
};

module.exports = { notFoundError };
