import { Schema, SchemaTypes, model } from "mongoose";
import { expenseTuple } from "../../utils/constants.mjs";

const expenseSchema = new Schema({
  description: SchemaTypes.String,
  value: {
    type: SchemaTypes.Number,
    required: [true, "you must specify the amount of the expense"],
  },
  category: {
    type: SchemaTypes.String,
    enum: expenseTuple,
    required: [true, "You must chose a category"],
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "You must specify user!"],
  },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now(),
  },
});

const Expense = model("Expense", expenseSchema);

export default Expense;
