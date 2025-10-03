## 🗂 Configuración de Ollama en el contenedor

Dentro de la carpeta `ia/ollama` se encuentra la instalación local de **Ollama** y los modelos descargados (`llama3:latest`). Esto permite ejecutar los nodos de IA de manera **offline** dentro del contenedor, sin necesidad de depender de una instalación externa o API externa.  

### Notas importantes
- La carpeta incluye:
  - Ejecutable de Ollama.
  - Modelos predescargados (por ejemplo `llama3:latest`).
  - Archivos de configuración internos.
- Asegúrate de mantener esta carpeta **dentro del contenedor** y no modificar la estructura, ya que los nodos en n8n apuntan a esta ubicación.
- Si necesitas actualizar los modelos, puedes usar el comando correspondiente de Ollama dentro del contenedor:
  ```bash
  ollama pull llama3:latest
