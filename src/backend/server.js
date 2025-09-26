const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configurado correctamente
app.use(cors({
  origin: [
    'https://acadwrite-front.vercel.app', 
    'http://localhost:3000',
    'http://localhost:5173'  // Add puerto Vite
  ],
  credentials: true
}));

app.use(express.json());

// Conexión MongoDB Atlas (versión simplificada para producción)
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB conectado exitosamente');
  
  // Iniciar servidor solo después de conectar a MongoDB
  app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
  });
})
.catch((error) => {
  console.error('Error conectando a MongoDB:', error);
  // Iniciar servidor incluso sin DB para que no falle el deploy
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT} (sin MongoDB)`);
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend AcadWrite funcionando',
    version: '1.0.0',
    status: 'active'
  });
});

// Ruta de health check (IMPORTANTE para Railway)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de prueba para CORS
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS funcionando correctamente', timestamp: new Date() });
});