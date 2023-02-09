import express from "express";
import { adminHome, upload, uploadPost } from "../controllers/adminController.js";
import { csrfProtection, onlyAdmin } from "../middleware.js";

const adminRouter = express.Router();

adminRouter.route("/").all(onlyAdmin).get(adminHome);
adminRouter.route("/upload").all(onlyAdmin, csrfProtection).get(upload).post(uploadPost);

export default adminRouter;
