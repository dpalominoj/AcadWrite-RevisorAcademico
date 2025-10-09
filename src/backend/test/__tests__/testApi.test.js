import request from "supertest";
import app from "../../app.js";

describe("Pruebas de la API /api/test", () => {
  test("GET /api/test debe responder con 200 y un mensaje", async () => {
    const response = await request(app).get("/api/test");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Pruebas de la API /api/test/student", () => {
  test("GET /api/test/student debe responder con 200 y un mensaje", async () => {
    const response = await request(app).get("/api/test/student");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Pruebas de la API /api/test/teacher", () => {
  test("GET /api/test/teacher debe responder con 200 y un mensaje", async () => {
    const response = await request(app).get("/api/test/teacher");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Pruebas de la API /api/test/admin", () => {
  test("GET /api/test/admin debe responder con 200 y un mensaje", async () => {
    const response = await request(app).get("/api/test/admin");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
  });
});
