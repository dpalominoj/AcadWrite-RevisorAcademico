import express from "express";
import Feedback from "../models/feedback.js";
import User from "../models/user.model.js";
import Document from "../models/document.model.js";

const router = express.Router();

// Listar estudiantes para los docentes
export const listStudents = async (req, res) => {
  try {
    const students = await User.aggregate([
      { $match: { role: "estudiante" } },
      {
        $lookup: {
          from: "documents",
          localField: "_id",
          foreignField: "userId",
          as: "documents",
        },
      },
      {
        $addFields: {
          lastUpload: { $max: "$documents.uploadedAt" },
          hasNewDocs: {
            $gt: [
              { $size: { $filter: { input: "$documents", as: "doc", cond: { $eq: ["$$doc.isReviewed", false] } } } },
              0
            ],
          },
        },
      },
      {
        $project: {
          documents: 0,
          password: 0,
        },
      },
    ]);

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al listar estudiantes" });
  }
};

//Extraer documentos de un estudiante específico
export const getStudentDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    const documents = await Document.find({ userId: id })
      .sort({ uploadedAt: -1 })
      .lean();

    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los documentos" });
  }
};

// Crear retroalimentación
export const createFeedback = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { studentId, documentIds, feedbackText, qualification } = req.body;

    // Validaciones básicas
    const student = await User.findById(studentId);
    const teacher = await User.findById(teacherId);
    if (!student || !teacher) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const docs = await Document.find({ _id: { $in: documentIds } });
    if (docs.length !== documentIds.length) {
      return res.status(400).json({ message: "Uno o más documentos no existen" });
    }

    const feedback = new Feedback({
      studentId,
      teacherId,
      documents: documentIds,
      feedbackText,
      qualification,
    });

    await Document.updateMany(
      { _id: { $in: documentIds } },
      { $set: { isReviewed: true, reviewedAt: new Date() } }
    );

    await feedback.save();
    res.status(201).json({ message: "Retroalimentación guardada", feedback });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la retroalimentación", error });
  }
};

//Obtener retroalimentación por documento
export const feedbackDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const feedbacks = await Feedback.find({ studentId: id })
      .populate("teacherId", "username email")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener retroalimentaciones" });
  }
};



