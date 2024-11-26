const { calculateArraySum, multiplyTwoNumbers } = require('../utils/calculations')


describe('Multiply two numbers', () => {
    test('Returns 2 as a result of 1 and 2', () => {
        return expect(multiplyTwoNumbers(1, 2)).resolves.toBe(2);
    });

    test('Returns 30 as a result of 3 and 10', () => {
        return expect(multiplyTwoNumbers(3, 10)).resolves.toBe(30);
    });

    test('Returns 30 as a result of 5 and 6', () => {
        return expect(multiplyTwoNumbers(5, 6)).resolves.toBe(30);
    });

    test('Returns 65 as a result of 13 and 5', () => {
        return expect(multiplyTwoNumbers(13, 5)).resolves.toBe(65);
    });

    test('Returns -6 as a result of -2 and 3', () => {
        return expect(multiplyTwoNumbers(-2, 3)).resolves.toBe(-6);
    });

    test('Returns 0 as a result of 0 and 5', () => {
        return expect(multiplyTwoNumbers(0, 5)).resolves.toBe(0);
    });

    test('Returns 1000000000000 as a result of 1000000 and 1000000', () => {
        return expect(multiplyTwoNumbers(1000000, 1000000)).resolves.toBe(1000000000000);
    });

    test('Returns 7.5 as a result of 2.5 and 3', () => {
        return expect(multiplyTwoNumbers(2.5, 3)).resolves.toBe(7.5);
    });

    test('Returns 0 as a result of 0 and 0', () => {
        return expect(multiplyTwoNumbers(0, 0)).resolves.toBe(0);
    });

    test('Returns error when inputs are not numbers (string input)', () => {
        return expect(multiplyTwoNumbers('a', 5)).rejects.toThrow('Expecting numbers');
    });

    test('Returns error when inputs are not numbers (undefined input)', () => {
        return expect(multiplyTwoNumbers(undefined, 5)).rejects.toThrow('Expecting numbers');
    });
});
