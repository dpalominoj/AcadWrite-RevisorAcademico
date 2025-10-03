# 📦 Infraestructura del Proyecto

Esta carpeta contiene los servicios necesarios para levantar el entorno de contenedores del proyecto y exponerlos a Internet mediante ngrok.

---

## 🐳 Servicios

- **n8n**: Plataforma de automatización de flujos de trabajo (workflow).  
  - Puerto local: `5678`  

- **ollama**: Servicio de IA con modelos locales (Llama 3).  
  - Puerto local: `11434`  

---

## 🚀 Cómo levantar los servicios

1. Levantar los contenedores Docker:
```bash
docker-compose -f infra/docker-compose.yml up -d

2. Iniciar los túneles ngrok para exponer los puertos:
```bash
ngrok start --all --config infra/ngrok.yml

