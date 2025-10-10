// tests/feedback.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js"; // Asegúrate de la ruta correcta
import { connectTestDB, closeTestDB, clearTestDB } from "../setup.js";


mongoose.Types.ObjectId.prototype.toString = function () {
  return this.toHexString();
};

import User from "../../admin-api/models/user.model.js";
import Document from "../../admin-api/models/document.model.js";
import Feedback from "../../admin-api/models/feedback.js";

beforeAll(async () => {
  await connectTestDB(); // Conectar DB en memoria
});

afterAll(async () => {
  await closeTestDB(); // Cerrar DB
});

afterEach(async () => {
  await clearTestDB(); // Limpiar colecciones
});

describe("Pruebas de la API /api/feedback", () => {
  beforeEach(async () => {
    // 🔹 Crear usuario estudiante
    const student = await User.create({
      username: "studentTest",
      email: "student@test.com",
      password: "123456",
      role: "estudiante",
    });

    studentId = student._id; // 🔹 Guardamos el ObjectId válido

    // 🔹 Crear feedback asociado a ese estudiante
    await Feedback.create({
      studentId,
      teacherId: new mongoose.Types.ObjectId(), // ID falso válido
      feedbackText: "Buen trabajo en la prueba",
      qualification: "Aprobado",
    });
  });

  test("GET /api/feedback debe responder con 200 y un mensaje", async () => {
    const response = await request(app).get("/api/feedback");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("GET /api/feedback/student/:id debe devolver feedbacks del estudiante", async () => {
    const res = await request(app).get(`/api/feedback/student/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].studentId).toBe(String(studentId));
  });
});

describe("POST /api/feedback/create", () => {
  test("Debe crear una retroalimentación correctamente", async () => {
    // 1️⃣ Crear usuario docente y estudiante en la BD
    const teacher = await User.create({
      username: "profesor",
      email: "teacher@example.com",
      password: "123456",
      role: "docente",
    });

    const student = await User.create({
      username: "alumno",
      email: "student@example.com",
      password: "123456",
      role: "estudiante",
    });

    // 2️⃣ Crear documentos asociados al estudiante
    const document1 = await Document.create({
      userId: student._id,
      fileName: "documento1.pdf",
      uploadedAt: new Date(),
    });

    const document2 = await Document.create({
      userId: student._id,
      fileName: "documento2.pdf",
      uploadedAt: new Date(),
    });

    // 3️⃣ Simular usuario autenticado (docente)
    app.request.user = teacher; // 👈 esto simula el req.user

    // 4️⃣ Hacer la petición POST
    const response = await request(app)
      .post("/api/feedback/create")
      .send({
        studentId: student._id,
        documentIds: [document1._id, document2._id],
        feedbackText: "Buen trabajo, pero revisa la gramática.",
        qualification: "Aprobado",
      });

    // 5️⃣ Validaciones
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Retroalimentación guardada");
    expect(response.body.feedback).toHaveProperty("_id");
    expect(response.body.feedback.feedbackText).toBe("Buen trabajo, pero revisa la gramática.");

    // 6️⃣ Confirmar que los documentos quedaron revisados
    const updatedDocs = await Document.find({ _id: { $in: [document1._id, document2._id] } });
    updatedDocs.forEach(doc => {
      expect(doc.isReviewed).toBe(true);
      expect(doc.reviewedAt).toBeDefined();
    });

    // 7️⃣ Confirmar que el feedback está en la BD
    const feedbacks = await Feedback.find();
    expect(feedbacks.length).toBe(1);
    expect(feedbacks[0].studentId.toString()).toBe(student._id.toString());
  });

  test("Debe responder 404 si el usuario no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    app.request.user = { _id: fakeId }; // docente falso

    const response = await request(app)
      .post("/api/feedback/create")
      .send({
        studentId: fakeId,
        documentIds: [],
        feedbackText: "Sin estudiante válido",
        qualification: "N/A",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "Usuario no encontrado");
  });
});

