import express from "express";
import { auth, authPost, home, logout } from "../controllers/globalController.js";
import { csrfProtection } from "../middleware.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/logout", logout);
globalRouter.route("/auth").all(csrfProtection).get(auth).post(authPost);

export default globalRouter;
