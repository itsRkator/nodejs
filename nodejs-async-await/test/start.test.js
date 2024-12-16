const { expect } = require("chai");

describe("Dummy Test cases to get started", () => {
  it("Should add numbers correctly", () => {
    const num1 = 2;
    const num2 = 3;

    expect(num1 + num2).to.equal(5);
  });

  it("Should not give a result of 6", () => {
    const num1 = 2;
    const num2 = 3;

    expect(num1 + num2).not.to.equal(6);
  });
});
