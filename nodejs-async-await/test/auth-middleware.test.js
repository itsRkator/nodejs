const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const { isAuthorized } = require("../src/middlewares/authorization");

describe("Authorization Middleware", () => {
  it("Should throw and error if no authorization header is present", () => {
    const req = {
      get: function () {
        return null;
      },
    };

    expect(isAuthorized.bind(this, req, {}, () => {})).to.throw("Unauthorized");
  });

  it("Should throw an error if the authorization header is only on string", () => {
    const req = {
      get: function () {
        return "xyz";
      },
    };

    expect(isAuthorized.bind(this, req, {}, () => {})).to.throw();
  });

  it("Should yield a userId after decoding the token", () => {
    const req = {
      get: function () {
        return "Bearer lkjsadfgsadewfsfsysdafsfdsadf";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    isAuthorized(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;

    jwt.verify.restore();
  });

  it("Should throw an error if the token cannot be verified", () => {
    const req = {
      get: function () {
        return "Bearer xyz";
      },
    };
    expect(isAuthorized.bind(this, req, {}, () => {})).to.throw();
  });
});
