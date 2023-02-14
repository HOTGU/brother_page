import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
dotenv.config();

export const home = async (req, res) => {
    const meta = {
        title: "홈",
    };
    try {
        const portfolios = await Portfolio.find({}).limit(4).sort({ createdAt: -1 });
        res.render("home", { meta, portfolios });
    } catch (error) {
        console.log(error);
    }
};

export const auth = (req, res) => {
    const meta = {
        title: "Auth",
    };
    if (req.session.user) {
        return res.redirect("/admin");
    }
    return res.render("auth", { meta, csrfToken: req.csrfToken() });
};

export const authPost = async (req, res) => {
    const {
        body: { id, pw: bodyPw },
    } = req;
    try {
        const user = await User.findOne({ id });
        if (!user) res.redirect("/");

        const comparePw = bcrypt.compareSync(bodyPw, user.pw);
        if (!comparePw) res.redirect("/");

        const userInfo = { ...user._doc };

        const { pw, ...otherInfo } = userInfo;

        const noPwUser = otherInfo;

        req.session.user = noPwUser;

        return res.redirect("/admin");
    } catch (error) {
        console.log(error);
    }
};
export const logout = (req, res) => {
    req.session.user = undefined;
    return res.redirect("/");
};

export const portfolio = async (req, res) => {
    try {
        const meta = {
            title: "공사실적",
        };
        const portfolios = await Portfolio.find({});
        return res.render("portfolio", { meta, portfolios });
    } catch (error) {
        console.log(error);
    }
};

export const portfolioDetail = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const portfolio = await Portfolio.findById(id);
        const meta = {
            title: portfolio.title,
        };
        return res.render("portfolioDetail", { meta, portfolio });
    } catch (error) {
        console.log(error);
    }
};
