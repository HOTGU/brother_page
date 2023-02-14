import express from "express";
import { adminHome, remove, upload, uploadPost } from "../controllers/adminController.js";
import { csrfProtection, onlyAdmin, s3Upload } from "../middleware.js";

const adminRouter = express.Router();

adminRouter.get("/", onlyAdmin, adminHome);
adminRouter
    .route("/upload")
    .all(onlyAdmin)
    .get(csrfProtection, upload)
    .post(s3Upload.array("photos", 10), csrfProtection, uploadPost);
adminRouter.get("/:portfolioId/remove", onlyAdmin, remove);

export default adminRouter;
