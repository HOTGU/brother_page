import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

export const home = (req, res) => {
    console.log(req.session.user);
    const meta = {
        title: "홈",
    };
    res.render("home", { meta });
};

export const auth = (req, res) => {
    const meta = {
        title: "Auth",
    };
    res.render("auth", { meta, csrfToken: req.csrfToken() });
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

        return res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};
export const logout = (req, res) => {
    req.session.user = undefined;
    return res.redirect("/");
};
