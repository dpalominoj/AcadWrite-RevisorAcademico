# 📄 Workflow de Corrección de Textos con n8n

## 📌 Descripción  
Este workflow automatiza el proceso de **corrección ortográfica y gramatical** de documentos PDF usando **n8n** y un modelo de lenguaje (Llama 3 vía Ollama).  
El flujo extrae el texto de un archivo PDF recibido mediante un webhook, lo procesa con IA, genera un nuevo PDF corregido y lo almacena en **Supabase Storage**.  

---

## ⚙️ Flujo General  

1. **Webhook**  
   - Recibe una petición `POST` con la URL de un PDF.  

2. **HTTP Request**  
   - Descarga el archivo desde la URL proporcionada.  

3. **Extract from File**  
   - Extrae el texto del PDF.  

4. **Edit Fields**  
   - Define variables (`text`, `new_url`, `bucket`).  

5. **AI Agent (LangChain + Ollama Chat Model)**  
   - Procesa el texto y corrige gramática y ortografía.  

6. **Code (JS)**  
   - Convierte el texto en HTML.  

7. **HTML to PDF**  
   - Genera un PDF con el contenido corregido.  

8. **Rename File (JS)**  
   - Ajusta el nombre del archivo final.  

9. **HTTP Request (Supabase)**  
   - Sube el PDF corregido a Supabase Storage.  

---

## 🚀 Disparadores (*Triggers*)  
- `POST` al endpoint del webhook (`/ce2958e7-9a9e-4159-8a8b-5528a2e5a766`).  

Ejemplo de body esperado:  
```json
{
  "userId": "usuario123",
  "url": "https://misarchivos.com/documento.pdf"
}
## 🧩 Requisitos Previos

- **n8n** instalado y corriendo.  
- **Ollama** con el modelo `llama3:latest`.  
- Credenciales configuradas:  
  - Ollama API (`Ollama account`).  
  - Supabase (API key y token Bearer).  

## 🔧 Personalización

- Puedes cambiar el **modelo de lenguaje** en el nodo *Ollama Chat Model*.  
- El nombre del archivo final se construye con la variable `new_url`.  
- Estilos del PDF se definen en el nodo `Code in JavaScript` (CSS dentro del HTML).  
