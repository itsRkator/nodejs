const calculateArraySum = (numArr) => {
    if (!Array.isArray(numArr) || numArr.length === 0) {
        return 0;
    }
    return numArr.reduce((prev, curr) => prev + curr, 0);
}

const multiplyTwoNumbers = (num1, num2) => {
    return new Promise((resolve, reject) => {
        console.log(typeof num1 !== 'number', typeof num2 !== 'number', isNaN(num1), isNaN(num2))
        if (typeof num1 !== 'number' || typeof num2 !== 'number' || isNaN(num1) || isNaN(num2)) {
            reject(new Error('Expecting numbers'));
        } else {
            resolve(num1 * num2);
        }
    });
}


module.exports = { calculateArraySum, multiplyTwoNumbers };
