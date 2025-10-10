// src/components/StudentCard.tsx
import React from "react";
import { UserOutlined, FileAddOutlined } from "@ant-design/icons";

interface StudentCardProps {
  student: {
    _id: string;
    username: string;
    email: string;
    lastUpload?: string | null;
    hasNewDocs?: boolean;
  };
  onSelect: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onSelect }) => {
  /*const hasNewDocs = student.lastUpload
    ? new Date(student.lastUpload) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // últimos 3 días
    : false;*/
  const hasNewDocs = student.hasNewDocs ?? false;

  return (
    <div
      className="border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white relative"
      onClick={() => onSelect(student._id)}
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-full">
          <UserOutlined className="text-blue-600 text-xl" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{student.username}</h3>
          <p className="text-sm text-gray-500">{student.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Último documento:{" "}
            {student.lastUpload
              ? new Date(student.lastUpload).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      {hasNewDocs && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <FileAddOutlined /> Nuevo
        </div>
      )}
    </div>
  );
};

export default StudentCard;
