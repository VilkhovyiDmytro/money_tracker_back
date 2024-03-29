import { Router } from "express";
import User from "../mongoose/shcemas/user.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";
import { updateExpTime } from "../utils/helpers.mjs";

const router = Router();

const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    newUser.password = undefined;
    next();
  } catch (error) {
    console.log(`ERROR 💥💥💥: ${error}`);
    res.send({ status: "FAIL", msg: error });
  }
};

const getUser = async (req, res) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const query = { ...req.query };
    const corrFields = ["expenses", "incomes"];
    const corrPopFileds = query.select
      .split(",")
      .filter((el) => corrFields.includes(el))
      .join(" ");

    const user = await User.findById(req.user._id)
      .populate(corrPopFileds)
      .exec();

    res.status(200).send(user);
  } catch (error) {
    console.log(`ERROR 💥💥💥: ${error}`);
    res.send({ status: "FAIL", msg: error });
  }
};

// const getAllTransactions = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     res.status(200).json({ status: "OK" });
//   } catch (error) {}
// };

router
  .route("/api/user/auth")
  .post(passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

router
  .route("/api/user/create")
  .post(createUser, passport.authenticate("local"), (req, res) =>
    res.status(201).json(req.user)
  );

router.get("/api/user", updateExpTime, getUser);

export default router;
