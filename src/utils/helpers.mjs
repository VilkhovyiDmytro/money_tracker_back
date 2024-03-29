import bcryptjs from "bcryptjs";

const saltRounds = process.env.SALT_ROUNDS || 10;

export const hashPassword = async (pass) => {
  const salt = await bcryptjs.genSalt(saltRounds);
  const hashedPassword = await bcryptjs.hash(pass, salt);
  return hashedPassword;
};

export const comparePasswords = async (plain, hashed) => {
  const res = await bcryptjs.compare(plain, hashed);
  return res;
};

export const updateExpTime = (req, res, next) => {
  req.login(req.user, (err) => {
    return err ? res.sendStatus(500) : next();
  });
};
