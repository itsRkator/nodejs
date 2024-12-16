const { calculateArraySum } = require("../utils/calculations");

describe("Sum of number from array", () => {
  test("Returns 3 as sum of numbers in array [-1, 2, 3, -1]", () => {
    expect(calculateArraySum([-1, 2, 3, -1])).toBe(3);
  });

  test("Returns 500500 as sum of first 1000 numbers in array", () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => i + 1);
    expect(calculateArraySum(largeArray)).toBe(500500); // Sum of first 1000 numbers
  });

  test("Returns 0 as sum of array with all zeros [0, 0, 0, 0]", () => {
    expect(calculateArraySum([0, 0, 0, 0])).toBe(0);
  });

  test("Returns 10.5 as sum of array [1.5, 2.5, 3.5, 3]", () => {
    expect(calculateArraySum([1.5, 2.5, 3.5, 3])).toBe(10.5);
  });

  test("Returns 0 for non-array input like object", () => {
    expect(calculateArraySum({ a: 1, b: 2 })).toBe(0);
  });

  test("Returns 0 as sum of numbers of array null", () => {
    expect(calculateArraySum(null)).toBe(0);
  });

  test("Returns 22 as sum of numbers of array [1, 2, 3, 4, 5, 7]", () => {
    expect(calculateArraySum([1, 2, 3, 4, 5, 7])).toBe(22);
  });

  test("Returns 0 as sum of numbers of array []", () => {
    expect(calculateArraySum([])).toBe(0);
  });
});
