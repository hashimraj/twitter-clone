import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ error: "User Not Found" });
        }

        req.user = user; // Attach user to request object for further use in the route
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in protectRoute middleware", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}