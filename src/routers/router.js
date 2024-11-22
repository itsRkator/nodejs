const express = require("express");
const { getSum } = require('../controllers/calculationController')

const router = express.Router();

router.get('/sum', getSum)

module.exports = router;