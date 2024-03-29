import { Schema, SchemaTypes, model } from "mongoose";
import { hashPassword } from "../../utils/helpers.mjs";

const userSchema = new Schema({
  username: {
    type: SchemaTypes.String,
    required: [true, "You must provide your username"],
    unique: [true, "Your username must be unique"],
  },
  password: {
    type: SchemaTypes.String,
    required: [true, "You must provide a password"],
    select: false,
  },
  expenses: {
    type: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Expense",
      },
    ],
  },
  incomes: {
    type: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Income",
      },
    ],
  },
  balance: {
    type: SchemaTypes.Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next, opt) {
  if (!opt.dontHashPass) this.password = await hashPassword(this.password);

  next();
});

const User = model("User", userSchema);

export default User;
