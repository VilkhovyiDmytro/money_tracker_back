import { Router } from "express";
import userRouter from "./user.mjs";
import incomesRouter from "./incomes.mjs";
import expencesRouter from "./expences.mjs";

const router = Router();

router.get("/api", (req, res) => {
  res.sendStatus(200);
});
router.use(userRouter);
router.use(incomesRouter);
router.use(expencesRouter);

export default router;
