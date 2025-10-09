import express from "express";

const router = express.Router();

// Ruta pública para pruebas
router.get("/", (req, res) => { res.status(200).json({ message: "API funcionando correctamente" });
});

// Acceso para admin o docente
router.get("/admin",(req, res) => { res.status(200).json({ message: "Hello Admin or Teacher" });
});

// Solo docentes
router.get("/teacher", (req, res) => { res.status(200).json({ message: "Hello Teacher" });
});

// Solo estudiantes
router.get("/student", (req, res) => { res.status(200).json({ message: "Hello Student" });
});

export default router;
