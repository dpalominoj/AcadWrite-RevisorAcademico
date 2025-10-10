import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import validatePassword from "../../utils/validatePassword.js";
import { errorHandler } from "../../utils/error.js";

/* SIN VALIDACION DE CONTRASEÑA
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // 1. Validar contraseña
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial."
      });
    }
    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // 3. Crear usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, role } = req.body;

  try {
    // Prepare the update object
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    // Update the user document using $set
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select('-password'); // Exclude the password field

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) return next(errorHandler(404, "User not found!"))

    const { password: pass, ...rest } = user._doc

    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id
  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
}

//Extracion para estadisticas del usuarios por rol
export const getDashboardStats = async (req, res) => {
  try {
    // Contar por rol
    const counts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 },
        },
      },
    ]);

    // Convertir el resultado en un objeto más claro
    const result = {
      administrador: 0,
      docente: 0,
      estudiante: 0,
    };

    counts.forEach((c) => {
      result[c._id] = c.total;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo conteo de usuarios por rol",
      error: error.message,
    });
  }
};

export const test = (req, res) => {
  res.json({
    message: "Api route is working!",
  })
}