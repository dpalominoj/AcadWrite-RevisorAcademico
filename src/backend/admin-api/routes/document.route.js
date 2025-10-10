import express from "express";
import multer from "multer";
import { verifyToken } from "../../middlewares/authMiddleware.js"; 
import { uploadDocument, getUserDocuments, getDashboardDocStats } from "../controllers/document.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Subida de documentos (solo si tiene alguno de esos roles)
router.post(
  "/upload",
  verifyToken(["administrador", "docente", "estudiante"]),
  upload.single("file"),
  uploadDocument
);

// Listar documentos del usuario logueado
router.get(
  "/lower",
  verifyToken(["administrador", "docente", "estudiante"]),
  getUserDocuments
);

// Estadísticas generales (no requiere login)
router.get("/stats", getDashboardDocStats);

export default router;
