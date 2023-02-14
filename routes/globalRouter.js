import express from "express";
import {
    auth,
    authPost,
    home,
    logout,
    portfolio,
    portfolioDetail,
} from "../controllers/globalController.js";
import { csrfProtection, onlyAdmin } from "../middleware.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/logout", logout);
globalRouter.get("/portfolio", portfolio);
globalRouter.get("/portfolio/:id", portfolioDetail);
globalRouter.route("/auth").all(csrfProtection).get(auth).post(authPost);

export default globalRouter;
