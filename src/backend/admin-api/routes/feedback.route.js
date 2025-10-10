import express from "express"
import { verifyToken } from "../../middlewares/authMiddleware.js";
import { createFeedback, feedbackDocument, listStudents, getStudentDocuments} from "../controllers/feedback.controller.js"

const router = express.Router()

// Ruta pública para pruebas
router.get("/", (req, res) => { res.status(200).json({ message: "API funcionando correctamente" });});
//Listar estudiantes
router.get("/students", verifyToken(["administrador", "docente"]), listStudents);
//Extraer documentos de un estudiante específico
router.get("/student/:id/documents", verifyToken(["administrador", "docente"]), getStudentDocuments);
//Crear retroalimentación
router.post("/create", createFeedback)
//Obtener retroalimentación por documento
router.get("/student/:id", feedbackDocument)


export default router
