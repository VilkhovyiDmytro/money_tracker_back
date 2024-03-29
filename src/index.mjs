import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import router from "./routes/index.mjs";
import cors from "cors";

const COOKIE_SECRET = process.env.COOKIE_SECRET || "secret";
const SESSION_SECRET = process.env.SESSION_SECRET || "session secret";
const DB_URL = "mongodb://localhost:27017/money_tracker";
const PORT = process.env.PORT || 3000;

configDotenv();
const app = express();
mongoose.connect(DB_URL).then(() => {
  console.log("DB connected");
});

app.use(cors());

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 60_000 * 10, // 10 min
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(router);
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
