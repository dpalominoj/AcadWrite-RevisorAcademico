import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectTestDB, closeTestDB, clearTestDB } from "../setup.js";
import User from "../../admin-api/models/user.model.js";

const { default: app } = await import("../../app.js");

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe("🧪 Rutas de Usuario", () => {
  test("GET /api/user/test → debe responder con mensaje correcto", async () => {
    const res = await request(app).get("/api/user/test");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Api route is working!" });
  });

  test("GET /api/user/all → debe devolver todos los usuarios", async () => {
    await User.create([
      { username: "Admin", email: "admin@mail.com", password: "123", role: "administrador" },
      { username: "Docente", email: "doc@mail.com", password: "123", role: "docente" },
    ]);

    const res = await request(app).get("/api/user/all");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty("email");
  });

  test("GET /api/user/user/:id → debe devolver detalles de un usuario existente", async () => {
    const user = await User.create({
      username: "Ana",
      email: "ana@mail.com",
      password: "123456",
      role: "estudiante",
    });

    const res = await request(app).get(`/api/user/user/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("Ana");
    expect(res.body).not.toHaveProperty("password");
  });

  test("GET /api/user/user/:id → debe devolver error si el usuario no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/user/user/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test("PUT /api/user/update/:id → debe actualizar un usuario correctamente", async () => {
    const user = await User.create({
      username: "Carlos",
      email: "carlos@mail.com",
      password: await bcrypt.hash("123456", 10),
      role: "docente",
    });

    const res = await request(app)
      .put(`/api/user/update/${user._id}`)
      .send({ username: "Carlos Editado", email: "nuevo@mail.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("Carlos Editado");
    expect(res.body.user.email).toBe("nuevo@mail.com");
  });

  test("PUT /api/user/update/:id → debe retornar 404 si no existe el usuario", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/user/update/${fakeId}`)
      .send({ username: "Inexistente" });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  test("DELETE /api/user/delete/:id → debe eliminar un usuario existente", async () => {
    const user = await User.create({
      username: "Eliminar",
      email: "del@mail.com",
      password: "123456",
      role: "docente",
    });

    const res = await request(app).delete(`/api/user/delete/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");

    const userInDb = await User.findById(user._id);
    expect(userInDb).toBeNull();
  });

  test("DELETE /api/user/delete/:id → debe devolver 404 si el usuario no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/user/delete/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  test("GET /api/user/stats → debe devolver conteo de usuarios por rol", async () => {
    await User.create([
      { username: "Admin", email: "a@mail.com", password: "123", role: "administrador" },
      { username: "Profe", email: "b@mail.com", password: "123", role: "docente" },
      { username: "Alumno", email: "c@mail.com", password: "123", role: "estudiante" },
      { username: "Alumno2", email: "d@mail.com", password: "123", role: "estudiante" },
    ]);

    const res = await request(app).get("/api/user/stats");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("administrador", 1);
    expect(res.body).toHaveProperty("docente", 1);
    expect(res.body).toHaveProperty("estudiante", 2);
  });
});
