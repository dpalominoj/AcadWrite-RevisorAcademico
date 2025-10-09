import Document from "../models/document.model.js";
import User from "../models/user.model.js";
import { supabase } from "../../supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const BUCKET_NAME = "Acceso";

export const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No se envió archivo" });
    }

    // Generar un ID único
    const uniqueId = `R${uuidv4()}`;

    // Nombre único
    const fileName = `${userId}/${Date.now()}-${uniqueId}`;

    // Subir a Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Error Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    // URL pública
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    // Guardar en Mongo
    const newDoc = new Document({
      userId,
      fileName: uniqueId,
      supabasePath: data.path,
      url: publicUrlData.publicUrl,
      uploadedAt: new Date(),
    });

    await newDoc.save();

    // AVISAR A N8N - Enviar todos los correos de docentes
    try {
      // 1. Buscar información del estudiante que subió el documento
      const estudiante = await User.findById(userId);

      // Buscar solo los emails de todos los docentes
      const docentes = await User.find(
        { role: 'docente' }, 
        { email: 1, _id: 0 } // Solo traer el campo email
      );
      
      // Extraer solo los correos electrónicos
      const correosDocentes = docentes.map(docente => docente.email);
      
      // Enviar al webhook de n8n
      await axios.post("https://duke-placement-sought-metadata.trycloudflare.com/webhook-test/ce2958e7-9a9e-4159-8a8b-5528a2e5a766", {
        estudiante: {
          userId: estudiante._id,
          username: estudiante.username,
          email: estudiante.email,
          username: estudiante.username,
        },
        documento: {
          url: publicUrlData.publicUrl,
          fileName: file.originalname,
          uniqueId: uniqueId,
          uploadDate: new Date().toISOString()
        },               
        correosDocentes: correosDocentes,
        totalDocentes: correosDocentes.length,        
      });
      
      //console.log(`N8N notificado correctamente. ${correosDocentes.length} docentes enviados para notificación.`);
      
    } catch (n8nError) {
      console.error("Error al enviar docentes a n8n:", n8nError.message);
      // No lanzamos el error para no afectar la subida del documento
    }

    res.status(201).json(newDoc);
  } catch (err) {
    console.error("Error al subir archivo:", err);
    res.status(500).json({ error: err.message });
  }
};

//Listar documentos del usuario autenticado
export const getUserDocuments = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No authenticated user found" });
    }
    const docs = await Document.find({ userId: req.user._id });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Extracion para estadisticas del dashboard
export const getDashboardDocStats = async (req, res) => {
  try {
    // 1. Documentos subidos por día (últimos 7 días)
    const documentosPorDia = await Document.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$uploadedAt" } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Ordenar por fecha ascendente
      { $limit: 7 },         // Opcional: limitar a los últimos 7 días
    ]);

    // 2. Top 5 usuarios con más documentos
    const topUsuarios = await Document.aggregate([
      {
        $group: {
          _id: "$userId",
          docs: { $sum: 1 },
        },
      },
      { $sort: { docs: -1 } }, // Ordenar por mayor cantidad
      { $limit: 5 },           // Solo los 5 primeros
      {
        $lookup: {
          from: "users",          // Nombre de la colección de usuarios
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },      // Convertir el array en objeto
      {
        $project: {
          username: "$user.username",
          docs: 1,
        },
      },
    ]);

    res.json({
      documentosPorDia,
      topUsuarios,
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas de documentos:", error);
    res.status(500).json({
      message: "Error obteniendo estadísticas de documentos",
      error: error.message,
    });
  }
};