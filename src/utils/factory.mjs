import User from "../mongoose/shcemas/user.mjs";

export const addTransaction = (type, Model) => {
  return async (req, res) => {
    try {
      const transaction = await Model.create({
        ...req.body,
        user: req.user._id,
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { [type]: transaction._id },
        $inc: {
          balance: type === "incomes" ? transaction.value : -transaction.value,
        },
      });

      res.status(201).send(transaction);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  };
};

export const deleteTransaction = (Model) => (req, res) => {
  const id = req.params.incomeId;
  Model.findByIdAndDelete(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
};

export const updateTransaction = (type, Model) => async (req, res) => {
  try {
    const id = req.params.incomeId;
    const transaction = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const user = await User.findById(req.user._id).populate(type).exec();

    user.balance = user.transaction.reduce((acc, cur) => (acc += cur.value), 0);

    await user.save({ dontHashPass: true });
    res.status(200).send(transaction);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const checkUserHasThisTransaction = (type) => (req, res, next) => {
  const id = req.params.incomeId;
  req.user[type].includes(id)
    ? next()
    : res
        .status(403)
        .send({ status: "Fail", msg: "You hasn't got this transaction" });
};

export const getTransactionForUser = (type, Model) => async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = await Model.find({ ...queryObj, user: req.user._id })
      .sort(req.query.sort)
      .select(req.query.fields?.replaceAll(",", " "));

    res.status(200).send(query);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
