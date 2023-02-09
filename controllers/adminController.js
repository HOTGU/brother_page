import Portfolio from "../models/Portfolio.js";

export const adminHome = async (req, res) => {
    const meta = {
        title: "Admin",
    };
    try {
        const portfolios = await Portfolio.find({});
        res.render("admin", { meta, portfolios });
    } catch (error) {
        console.log(error);
    }
};

export const upload = (req, res) => {
    res.render("upload", { meta: { title: "업로드" }, csrfToken: req.csrfToken() });
};

export const uploadPost = (req, res) => {};
