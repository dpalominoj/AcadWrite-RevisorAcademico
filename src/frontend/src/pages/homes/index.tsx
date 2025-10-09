import React, { useState } from "react";
import { message } from "antd";

const UploadPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      message.error("Solo se permiten archivos PDF 📄");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Obtener el token guardado
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/document/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error en la subida");
      }

      const data = await res.json();
      console.log("Documento guardado:", data);

      message.success("Archivo PDF subido con éxito");
    } catch (error) {
      console.error("Error al subir:", error);
      message.error("Error al subir archivo");
    } finally {
      setUploading(false);
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="p-6 mx-full bg-white shadow-lg rounded-2xl border border-gray-200 h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Subir Archivo PDF
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-6 h-[calc(100%-4rem)]">
        {/* Columna izquierda: subir archivo */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition h-full">
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4v6H4v-6m16 0a2 2 0 00-2-2H6a2 2 0 00-2 2"
              />
            </svg>
            <p className="text-gray-500 text-center">
              Haz clic o arrastra un PDF aquí
            </p>
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`mt-6 w-full px-4 py-2 rounded-xl text-white font-semibold shadow-md transition ${uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {uploading ? "Subiendo..." : "Subir PDF"}
          </button>
        </div>

        {/* Columna derecha: previsualización */}
        <div className="border rounded-xl bg-gray-50 shadow-inner h-full flex mr-6">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full rounded-lg"
              title="Vista previa PDF"
            />
          ) : (
            <p className="text-gray-500 m-auto">
              No hay archivo seleccionado 📂
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPDF;


