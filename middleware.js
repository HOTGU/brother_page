import csrf from "csurf";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";

export const csrfProtection = csrf({ cookie: true });

export const onlyAdmin = (req, res, next) => {
    const user = req.session.user;
    if (!user) return res.redirect("/");
    if (!user?.isAdmin) return res.redirect("/");
    next();
};

export const setLocal = (req, res, next) => {
    res.locals.user = req.session.user || undefined;
    next();
};

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS,
        secretAccessKey: process.env.AWS_S3_SCERET,
    },
    region: process.env.AWS_S3_REGION,
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});

export const s3Upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET,
        key: function (req, file, cb) {
            cb(null, `public/${Date.now()}_${file.originalname}`);
        },
    }),
});
