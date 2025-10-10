import React, { useEffect, useState } from "react";

type DocumentType = {
  _id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
  correctedUrl?: string;
};

const makeCorrectedUrl = (url: string) => {
  // Si ya tiene -C asumimos que es la corregida
  if (url.includes("-C")) return url;

  // Si tiene extensión (ej. .pdf) -> insertar -C antes de la extensión
  const lastSegment = url.substring(url.lastIndexOf("/") + 1);
  if (lastSegment.includes(".")) {
    // Reemplaza la última extensión por -C.ext
    return url.replace(/\.([^.\/?#]+)$/, "-C.$1");
  }

  // Si no tiene extensión -> añade -C.pdf
  return `${url}-C.pdf`;
};

const checkExists = async (url: string) => {
  try {
    // Primero intentamos HEAD (liviano)
    const headRes = await fetch(url, { method: "HEAD" });
    if (headRes.ok) return true;

    // Si HEAD no es soportado o devuelve 405/403/404, probamos GET con Range (solo primeros bytes)
    // Algunos servidores bloquean HEAD, por eso fallback.
    if ([405, 403, 404].includes(headRes.status) || !headRes.ok) {
      try {
        const getRes = await fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-1" },
        });
        return getRes.ok;
      } catch {
        return false;
      }
    }

    return false;
  } catch (err) {
    return false;
  }
};

const DocumentViewer: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [previewWhich, setPreviewWhich] = useState<"original" | "corrected">(
    "original"
  );

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/document/lower`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener documentos");
        const data: DocumentType[] = await res.json();

        // Asociar posible correctedUrl verificando su existencia
        const enhanced = await Promise.all(
          data.map(async (doc) => {
            const candidate = makeCorrectedUrl(doc.url);
            const exists = await checkExists(candidate);
            return exists ? { ...doc, correctedUrl: candidate } : doc;
          })
        );

        setDocuments(enhanced);
        if (enhanced.length > 0) setSelectedDoc(enhanced[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDocuments();
  }, []);

  const handleSelect = (doc: DocumentType) => {
    setSelectedDoc(doc);
    setPreviewWhich("original");
  };

  return (
    <div className="p-6 mx-full bg-white shadow-lg rounded-2xl border border-gray-200 h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mis Archivos</h1>

      <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-6 h-[calc(100%-4rem)]">
        <div className="border-2 border-dashed rounded-xl bg-gray-50 shadow-inner p-4 overflow-y-auto h-full">
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No hay documentos disponibles 📂</p>
          ) : (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc._id}
                  className={`p-3 rounded-lg cursor-pointer border transition ${
                    selectedDoc?._id === doc._id
                      ? "border-blue-600 bg-blue-50 shadow"
                      : "border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(doc)}
                >
                  <p className="font-semibold">{doc.fileName}</p>
                  <p className="text-sm text-gray-500">
                    Subido: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                  {doc.correctedUrl && (
                    <p className="text-xs text-green-600 font-semibold">✅ Versión corregida disponible</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border rounded-xl bg-gray-50 shadow-inner h-full flex flex-col mr-6">
          {selectedDoc ? (
            <>
              <div className="flex items-center justify-between p-3 border-b">
                <h2 className="font-semibold text-gray-800">{selectedDoc.fileName}</h2>

                <div className="flex items-center gap-3">
                  {selectedDoc.correctedUrl && (
                    <>
                      <button
                        onClick={() => setPreviewWhich("original")}
                        className={`px-3 py-1 rounded ${previewWhich === "original" ? "bg-blue-600 text-white" : "bg-white/50"}`}
                      >
                        Original
                      </button>
                      <button
                        onClick={() => setPreviewWhich("corrected")}
                        className={`px-3 py-1 rounded ${previewWhich === "corrected" ? "bg-blue-600 text-white" : "bg-white/50"}`}
                      >
                        Corregido
                      </button>
                      <a
                        href={selectedDoc.correctedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline text-blue-600 ml-3"
                      >
                        Abrir corregido en pestaña
                      </a>
                    </>
                  )}
                </div>
              </div>

              <iframe
                src={previewWhich === "original" ? selectedDoc.url : selectedDoc.correctedUrl || selectedDoc.url}
                className="w-full h-full rounded-b-lg"
                title={selectedDoc.fileName}
              />
            </>
          ) : (
            <p className="text-gray-500 m-auto text-center">Selecciona un documento para previsualizar 📄</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
