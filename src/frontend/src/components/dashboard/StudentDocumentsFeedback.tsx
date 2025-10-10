import { useEffect, useState } from "react"
import { Input, Button, Spin, message, Modal } from "antd"
import { FilePdfOutlined, SendOutlined, CheckCircleFilled } from "@ant-design/icons"
import { motion } from "framer-motion"

interface Document {
  _id: string
  fileName: string
  url: string
  uploadedAt: string
}

interface FeedbackForm {
  comentario: string
  calificacion: string
}

interface Props {
  studentId: string
}

export default function StudentDocumentsFeedback({ studentId }: Props) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackForm>>({})
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [reviewedDocs, setReviewedDocs] = useState<Set<string>>(new Set()) // 👈 para controlar documentos revisados
  const token = localStorage.getItem("token")

  // Cargar documentos del estudiante
  useEffect(() => {
    if (!studentId) return

    const fetchDocs = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/feedback/student/${studentId}/documents`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const data = await res.json()
        setDocuments(Array.isArray(data) ? data : [])

        // Inicializa feedbacks
        const initialFeedbacks = (data || []).reduce(
          (acc: Record<string, FeedbackForm>, doc: Document) => {
            acc[doc._id] = { comentario: "", calificacion: "" }
            return acc
          },
          {}
        )
        setFeedbacks(initialFeedbacks)
      } catch (error) {
        console.error(error)
        message.error("Error al cargar documentos del estudiante")
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [studentId])

  // Enviar retroalimentación
  const handleSubmit = async (documentId: string) => {
    const feedback = feedbacks[documentId]
    if (!feedback.comentario || !feedback.calificacion) {
      message.warning("Completa todos los campos antes de enviar.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          documentIds: [documentId],
          feedbackText: feedback.comentario,
          qualification: feedback.calificacion,
        }),
      })

      if (!res.ok) throw new Error()
      message.success("Retroalimentación enviada correctamente")

      // Marcar documento como revisado ✅
      setReviewedDocs((prev) => new Set(prev).add(documentId))

      setFeedbacks({
        ...feedbacks,
        [documentId]: { comentario: "", calificacion: "" },
      })
      setOpen(false)
    } catch {
      message.error("Error al enviar la retroalimentación")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spin tip="Cargando documentos..." />

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">📚 Documentos del estudiante</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.length > 0 ? (
          documents.map((doc) => {
            const isReviewed = reviewedDocs.has(doc._id)
            return (
              <motion.div
                key={doc._id}
                whileHover={{ scale: 1.03 }}
                className="relative rounded-2xl shadow-md bg-white border hover:border-blue-400 cursor-pointer p-4 transition-all"
                onClick={() => {
                  setSelectedDoc(doc)
                  setOpen(true)
                }}
              >
                {/* ✅ Icono de revisado */}
                {isReviewed && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleFilled style={{ color: "#52c41a", fontSize: 22 }} />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <FilePdfOutlined style={{ fontSize: 22, color: "#f5222d" }} />
                  <div>
                    <p className="font-medium">{doc.fileName}</p>
                    <p className="text-xs text-gray-500">
                      Subido el: {new Date(doc.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <p>No se encontraron documentos.</p>
        )}
      </div>

      {/* Modal fullscreen */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="100%"
        style={{ top: 0, padding: 0 }}
        bodyStyle={{ height: "100vh", margin: 0, padding: 0 }}
      >
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {/* Documento PDF */}
            <div className="flex-1 bg-gray-100 overflow-hidden">
              <iframe
                src={selectedDoc.url}
                className="w-full h-full border-none"
                title={selectedDoc.fileName}
              />
            </div>

            {/* Formulario de retroalimentación */}
            <div className="bg-white p-6 border-t shadow-inner">
              <h3 className="text-lg font-semibold mb-3">
                ✏️ Retroalimentación para {selectedDoc.fileName}
              </h3>

              <Input.TextArea
                rows={4}
                placeholder="Escribe tus comentarios aquí..."
                value={feedbacks[selectedDoc._id]?.comentario || ""}
                onChange={(e) =>
                  setFeedbacks({
                    ...feedbacks,
                    [selectedDoc._id]: {
                      ...feedbacks[selectedDoc._id],
                      comentario: e.target.value,
                    },
                  })
                }
                className="mb-3"
              />

              <Input
                placeholder="Calificación (ej. 17/20 o A)"
                value={feedbacks[selectedDoc._id]?.calificacion || ""}
                onChange={(e) =>
                  setFeedbacks({
                    ...feedbacks,
                    [selectedDoc._id]: {
                      ...feedbacks[selectedDoc._id],
                      calificacion: e.target.value,
                    },
                  })
                }
                className="mb-4"
              />

              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => handleSubmit(selectedDoc._id)}
                loading={loading}
                className="w-full"
              >
                Enviar Retroalimentación
              </Button>
            </div>
          </motion.div>
        )}
      </Modal>
    </div>
  )
}
