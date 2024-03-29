import { Router } from "express";
import Income from "../mongoose/shcemas/incomes.mjs";
import {
  addTransaction,
  checkUserHasThisTransaction,
  deleteTransaction,
  getTransactionForUser,
  updateTransaction,
} from "../utils/factory.mjs";
import { updateExpTime } from "../utils/helpers.mjs";

const router = Router();

const createIncome = addTransaction("incomes", Income);

const getIncomesForUser = getTransactionForUser("incomes", Income);

const updateIncome = updateTransaction("incomes", Income);

const deleteIncomeForUser = deleteTransaction(Income);

const checkUserHasThisIncome = checkUserHasThisTransaction("incomes");

router.use(updateExpTime);

router.route("/api/incomes").post(createIncome).get(getIncomesForUser);

router
  .route("/api/incomes/:incomeId")
  .all(checkUserHasThisIncome)
  .patch(updateIncome)
  .delete(deleteIncomeForUser);

export default router;
