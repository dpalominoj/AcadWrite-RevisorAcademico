
import { jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { connectTestDB, closeTestDB, clearTestDB } from "../setup.js";
import User from "../../admin-api/models/user.model.js";

const mockObjectId = new mongoose.Types.ObjectId().toString();

await jest.unstable_mockModule("../../middlewares/authMiddleware.js", () => ({
  __esModule: true,
  verifyToken: (roles = []) => (req, res, next) => {
    req.user = { _id: mockObjectId, role: roles[0] || "docente" };
    next();
  },
}));

// 🚀 Importamos la app DESPUÉS del mock
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

describe("GET /api/feedback/students", () => {
  test("Debe devolver lista de estudiantes con 200 OK", async () => {
    await User.create([
      { username: "Juan", email: "juan@test.com", password: "123456", role: "estudiante" },
      { username: "Ana", email: "ana@test.com", password: "123456", role: "estudiante" },
      { username: "Profesor", email: "profe@test.com", password: "123456", role: "docente" },
    ]);

    const response = await request(app).get("/api/feedback/students");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    response.body.forEach((student) => {
      expect(student.role).toBe("estudiante");
    });
  });

  test("Debe devolver un arreglo vacío si no hay estudiantes", async () => {
    const response = await request(app).get("/api/feedback/students");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});
