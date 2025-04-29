import jwt from "jsonwebtoken";

export const ensureAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1] || req.body.token;

    if (!token) {
        return res.status(401).json({ ok: false, message: "Token Not Found!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_CODE);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ ok: false, message: "Unauthorized Access!" });
    }
};
