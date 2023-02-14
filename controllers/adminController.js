import Portfolio from "../models/Portfolio.js";

export const adminHome = async (req, res) => {
    const meta = {
        title: "Admin",
    };
    try {
        const portfolios = await Portfolio.find({});
        return res.render("admin", { meta, portfolios });
    } catch (error) {
        console.log(error);
    }
};

export const upload = (req, res) => {
    res.render("upload", { meta: { title: "업로드" }, csrfToken: req.csrfToken() });
};

export const uploadPost = async (req, res) => {
    const {
        body: { title, desc },
        files,
    } = req;
    try {
        const photos = files.map((file) => file.location);
        await Portfolio.create({
            photos,
            title,
            desc,
        });
        return res.redirect("/admin");
    } catch (error) {
        console.log(error);
    }
};

export const remove = async (req, res) => {
    const {
        params: { portfolioId },
    } = req;
    try {
        await Portfolio.findByIdAndRemove(portfolioId);
        return res.redirect("/admin");
    } catch (error) {
        console.log(error);
    }
};
