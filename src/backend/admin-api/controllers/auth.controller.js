import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../../utils/error.js';
import validatePassword from "../../utils/validatePassword.js";

export const signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial."
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Nuevo usuario creado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*Registro exclusivo de estudiantes*/
export const signupStudent = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial."
      });
    }

    // Verificar si ya existe el correo
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "estudiante" // forzado
    });
    await newUser.save();

    res.status(201).json({ message: 'Estudiante creado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Credentials"));

    // Generar token con expiración
    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const { password: pass, ...rest } = validUser._doc;

    // Devolvemos el token directamente en JSON
    res.status(200).json({
      ...rest,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token")
    res.status(200).json({ message: "User has been signed out..." })
  } catch (error) {
    next(error)
  }
}
