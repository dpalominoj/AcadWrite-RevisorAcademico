import jwt from "jsonwebtoken";
import User from "../admin-api/models/user.model.js";

export const verifyToken = (roles = []) => async (req, res, next) => {
  try {
    // Obtenemos el header "Authorization: Bearer <token>"
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token not found!" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer token"
    if (!token) {
      return res.status(401).json({ message: "Token not found!" });
    }

    //  Verificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    //  Obtenemos el usuario de la DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Validamos roles si se pasó un array (ej: ["admin"])
    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({
        message: "You don't have permission to perform this action",
      });
    }

    req.user = user; // Guardamos el usuario en req
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
