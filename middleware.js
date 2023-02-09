import csrf from "csurf";

export const csrfProtection = csrf({ cookie: true });

export const onlyAdmin = (req, res, next) => {
    const user = req.session.user;
    if (!user) res.redirect("/");
    const admin = user.isAdmin;
    if (!admin) res.redirect("/");
    next();
};

export const setLocal = (req, res, next) => {
    res.locals.user = req.session.user || undefined;
    next();
};
