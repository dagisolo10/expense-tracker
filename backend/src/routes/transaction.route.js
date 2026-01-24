const express = require("express");
const router = express.Router();
const { addTransaction, deleteTransaction, updateTransaction, getAllTransactions, getTransaction } = require("../controllers/transaction.controller");
const { authorize } = require("../middlewares/auth.middleware");
router.use(authorize);

router.get("/", getAllTransactions);
router.post("/", addTransaction);
router.get("/:id", getTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
