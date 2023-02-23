import express from "express";
import cookieParser from "cookie-parser";

import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import mongoose from "mongoose";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import globalRouter from "./routes/globalRouter.js";
import adminRouter from "./routes/adminRouter.js";
import { setLocal } from "./middleware.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const NODE_ENV = process.env.NODE_ENV;

console.log(NODE_ENV);
console.log(process.env.NODE_ENV === "Production");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
mongoose.set("strictQuery", true);
mongoose.connect(MONGO_URL);

const db = mongoose.connection;

const handleDBError = () => console.log("❌DB연결 실패");
const handleDBSuccess = () => console.log(`✅DB연결 성공`);

db.on("error", handleDBError);
db.once("open", handleDBSuccess);

const cspOptions = {
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    "default-src": ["'self'", "blob:*", "*.fontawesome.com"],
    "img-src": [
      "'self'",
      "blob:",
      "data:",
      "https://sunnusu.s3.ap-northeast-2.amazonaws.com",
    ],
    "script-src": [
      "'self'",
      "*.fontawesome.com",
      "https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.0/dist/browser-image-compression.js",
    ],
  },
};

app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
    crossOriginEmbedderPolicy: false,
  })
);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));
app.use("/static", express.static(__dirname + "/static"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGO_URL }),
    cookie: {
      maxAge: 3.6e6 * 24,
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "Production",
    },
  })
);

app.use(setLocal);

app.use("/", globalRouter);
app.use("/admin", adminRouter);

const serverListen = () => console.log("✅서버실행중");

app.listen(PORT, serverListen);

export default app;
