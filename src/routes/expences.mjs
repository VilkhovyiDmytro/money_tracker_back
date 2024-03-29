import { Router } from "express";
import {
  addTransaction,
  checkUserHasThisTransaction,
  deleteTransaction,
  getTransactionForUser,
  updateTransaction,
} from "../utils/factory.mjs";
import Expense from "../mongoose/shcemas/expences.mjs";
import { updateExpTime } from "../utils/helpers.mjs";

const router = Router();

const getIncomesForUser = getTransactionForUser("expenses", Expense);

const updateIncome = updateTransaction("expenses", Expense);

const deleteIncomeForUser = deleteTransaction(Expense);

const createExpense = addTransaction("expenses", Expense);

const checkUserHasThisIncome = checkUserHasThisTransaction("expenses");

router.use(updateExpTime);

router.route("/api/expense").post(createExpense).get(getIncomesForUser);

router
  .route("/api/expense/:incomeId")
  .all(checkUserHasThisIncome)
  .patch(updateIncome)
  .delete(deleteIncomeForUser);

export default router;
