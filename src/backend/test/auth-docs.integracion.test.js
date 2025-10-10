import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import User from '../admin-api/models/user.model.js';
import Document from '../admin-api/models/document.model.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

describe('Prueba de Integración Completa: Signup y Acceso a Documentos', () => {
  let userA, userB, tokenA, tokenB, docA;

  beforeAll(async () => {
    await connectTestDB();
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('Módulo 1: Autenticación de Estudiante', () => {
    test('Debe registrar al Usuario A', async () => {
      const res = await request(app).post('/api/auth/signup-student').send({
        username: 'userA',
        email: 'usera@example.com',
        password: 'Password@123',
      });
      expect(res.statusCode).toBe(201);
    });

    test('Debe registrar al Usuario B', async () => {
      const res = await request(app).post('/api/auth/signup-student').send({
        username: 'userB',
        email: 'userb@example.com',
        password: 'Password@123',
      });
      expect(res.statusCode).toBe(201);
    });

    test('Debe buscar a los usuarios en la BD y generar sus tokens', async () => {
      userA = await User.findOne({ email: 'usera@example.com' });
      userB = await User.findOne({ email: 'userb@example.com' });

      expect(userA).not.toBeNull();
      expect(userB).not.toBeNull();

      tokenA = jwt.sign({ id: userA._id, role: userA.role }, process.env.JWT_SECRET_KEY);
      tokenB = jwt.sign({ id: userB._id, role: userB.role }, process.env.JWT_SECRET_KEY);
      
      expect(tokenA).toBeDefined();
      expect(tokenB).toBeDefined();
    });

    test('Debe crear un documento para el Usuario A', async () => {
      expect(userA).toBeDefined();

      docA = new Document({
        userId: userA._id,
        fileName: 'documento_de_A.pdf',
        supabasePath: 'path/to/documento_de_A.pdf',
        url: 'http://example.com/documento_de_A.pdf',
      });
      await docA.save();

      const docInDb = await Document.findById(docA._id);
      expect(docInDb).not.toBeNull();
      expect(docInDb.userId.toString()).toBe(userA._id.toString());
    });
  });

  describe('Módulo 2: Verificación de Permisos de Documentos', () => {
    test('Debe permitir al Usuario A ver sus propios documentos', async () => {
      const response = await request(app)
        .get('/api/document/lower')
        .set('Authorization', `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].fileName).toBe(docA.fileName);
    });

    test('Debe impedir que el Usuario B vea los documentos del Usuario A', async () => {
      const response = await request(app)
        .get('/api/document/lower')
        .set('Authorization', `Bearer ${tokenB}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });
  });
});
