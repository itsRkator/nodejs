const { calculateArraySum } = require('../utils/calculations');

const getSum = (req, res, next) => {
    const { nums } = req.query;
    try {
        const sum = calculateArraySum(nums.map(Number));

        res.json({ sum });
    } catch (err) {
        console.error(err)
    }
}

module.exports = { getSum }