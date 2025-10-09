// src/pages/TeacherDashboard.tsx
import React, { useEffect, useState } from "react";
import StudentCard from "../../components/dashboard/StudentCard.tsx";
import StudentDocumentsFeedback from "../../components/dashboard/StudentDocumentsFeedback.tsx";
import { Button } from "antd";

type Student = {
  _id: string;
  username: string;
  email: string;
  lastUpload?: string | null;
};

const TeacherDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (selectedStudent) {
    // Si se seleccionó un estudiante, mostrar su detalle
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedStudent.username} — Documentos
          </h2>
          <Button onClick={() => setSelectedStudent(null)}>← Volver</Button>
        </div>
        <StudentDocumentsFeedback studentId={selectedStudent._id} />
      </div>
    );
  }

  // Vista principal con cards
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Estudiantes</h1>

      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {students.map((stu) => (
            <StudentCard key={stu._id} student={stu} onSelect={(id) => {
              const found = students.find((s) => s._id === id);
              if (found) setSelectedStudent(found);
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
