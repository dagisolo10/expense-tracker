const express = require("express");
const router = express.Router();
const { getCategoryTotal, getTotalExpense, getTotalIncome, getTotalBalance, getDashboardStats } = require("../controllers/analytics.controller");
const { authorize } = require("../middlewares/auth.middleware");
router.use(authorize);

router.get("/total-balance", getTotalBalance);
router.get("/total-income", getTotalIncome);
router.get("/total-expense", getTotalExpense);
router.get("/category-total", getCategoryTotal);
router.get("/", getDashboardStats);

module.exports = router;
