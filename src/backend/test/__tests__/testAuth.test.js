// test/__tests__/authRoutes.test.js
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../admin-api/models/user.model.js";
import { connectTestDB, closeTestDB, clearTestDB } from "../setup.js";

const { default: app } = await import("../../app.js");

// Configuración de entorno (puede que Jest necesite una clave fake)
process.env.JWT_SECRET_KEY = "test_secret_key";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe("Auth Routes", () => {
  describe("POST /api/auth/signup", () => {
    test("Debe crear un nuevo usuario (201)", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "Carlos",
          email: "carlos@test.com",
          password: "Password@123",
          role: "docente",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Nuevo usuario creado");

      const user = await User.findOne({ email: "carlos@test.com" });
      expect(user).not.toBeNull();
      expect(user.role).toBe("docente");
    });

    test("Debe fallar si la contraseña no cumple requisitos", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          username: "Ana",
          email: "ana@test.com",
          password: "123", // inválida
          role: "admin",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/contraseña debe tener al menos/i);
    });
  });

  describe("POST /api/auth/signup-student", () => {
    test("Debe registrar estudiante con rol 'estudiante'", async () => {
      const res = await request(app)
        .post("/api/auth/signup-student")
        .send({
          username: "Juan",
          email: "juan@test.com",
          password: "Password@123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Estudiante creado");

      const user = await User.findOne({ email: "juan@test.com" });
      expect(user.role).toBe("estudiante");
    });

    test("Debe devolver 409 si el correo ya existe", async () => {
      await User.create({
        username: "Juan",
        email: "juan@test.com",
        password: bcrypt.hashSync("Password@123", 10),
        role: "estudiante",
      });

      const res = await request(app)
        .post("/api/auth/signup-student")
        .send({
          username: "Juan",
          email: "juan@test.com",
          password: "Password@123",
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("El correo ya está registrado.");
    });
  });

  describe("POST /api/auth/signin", () => {
    test("Debe permitir iniciar sesión correctamente", async () => {
      const hashed = bcrypt.hashSync("Password@123", 10);
      await User.create({
        username: "Carlos",
        email: "carlos@test.com",
        password: hashed,
        role: "docente",
      });

      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          email: "carlos@test.com",
          password: "Password@123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");

      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET_KEY);
      expect(decoded).toHaveProperty("id");
      expect(decoded).toHaveProperty("role", "docente");
    });

    test("Debe fallar si el usuario no existe", async () => {
      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          email: "noexiste@test.com",
          password: "Password@123",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    test("Debe fallar si la contraseña es incorrecta", async () => {
      const hashed = bcrypt.hashSync("Password@123", 10);
      await User.create({
        username: "Carlos",
        email: "carlos@test.com",
        password: hashed,
        role: "docente",
      });

      const res = await request(app)
        .post("/api/auth/signin")
        .send({
          email: "carlos@test.com",
          password: "WrongPass@123",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid Credentials");
    });
  });

  describe("POST /api/auth/signout", () => {
    test("Debe cerrar sesión y limpiar cookies", async () => {
      const res = await request(app).post("/api/auth/signout");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User has been signed out...");
    });
  });
});
