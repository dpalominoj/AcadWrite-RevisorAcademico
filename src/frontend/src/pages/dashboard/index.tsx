// src/pages/dashboard/index.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Card, CardContent } from "../../components/ui/Card";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Interfaces de tipado
interface UsuariosResponse {
  administrador: number;
  docente: number;
  estudiante: number;
}

interface DocumentoDia {
  _id: string;
  total: number;
}

interface TopUsuario {
  username: string;
  docs: number;
}

const DashboardPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuariosResponse>({
    administrador: 0,
    docente: 0,
    estudiante: 0,
  });
  const [documentosDia, setDocumentosDia] = useState<DocumentoDia[]>([]);
  const [topUsuarios, setTopUsuarios] = useState<TopUsuario[]>([]);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // o donde guardes el token

    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/stats`,
          {
            headers: { Authorization: `Bearer ${token}` }, // aquí va el token
          }
        );
        setUsuarios(res.data);
        setStartCount(true);
      } catch (error) {
        console.error("Error obteniendo datos del dashboard", error);
      }
    };

    const fetchDocs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/document/stats`,
          {
            headers: { Authorization: `Bearer ${token}` }, // aquí va el token
          }
        );
        setDocumentosDia(res.data.documentosPorDia);
        setTopUsuarios(res.data.topUsuarios);
      } catch (error) {
        console.error("Error obteniendo datos de documentos", error);
      }
    };

    fetchDashboard();
    fetchDocs();
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
      {/* Total de estudiantes */}
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }}>
        <Card>
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold text-green-600">Total de estudiantes</h2>
            <p className="text-4xl font-bold text-green-600">
              {startCount && <CountUp end={usuarios.estudiante} duration={2} />}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total de docentes */}
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }}>
        <Card>
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold text-blue-600">Total de docentes</h2>
            <p className="text-4xl font-bold text-blue-600">
              {startCount && <CountUp end={usuarios.docente} duration={2} />}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total de administradores */}
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 200 }}>
        <Card>
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold text-orange-600">Total de administradores</h2>
            <p className="text-4xl font-bold text-orange-600">
              {startCount && <CountUp end={usuarios.administrador} duration={2} />}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Documentos subidos por día */}
      <motion.div
        className="md:col-span-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold mb-5">Documentos subidos por día</h2>
            <ResponsiveContainer width="95%" height={350}>
              <LineChart data={documentosDia.map(d => ({ day: d._id, documentos: d.total }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="documentos"
                  stroke="#8884d8"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top 5 usuarios */}
      <motion.div
        className="md:col-span-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Card className="max-w-4xl mx-auto">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold mb-5">Top 5 usuarios con más documentos</h2>
            <ResponsiveContainer width="95%" height={350}>
              <BarChart data={topUsuarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="username" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="docs"
                  fill="#82ca9d"
                  animationDuration={2000}
                  animationBegin={500}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
