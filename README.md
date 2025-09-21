# Proyecto MERN
> AcadWrite - Revisor Automático de Escritura Académica

## Tabla de contenido
1. [Descripción del Proyecto](#descripción)
2. [Características](#características)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Requisitos Previos](#requisitos-previos)
5. [Instalación](#instalación)
6. [Ejecución del Proyecto](#ejecución-del-proyecto)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Scripts Disponibles](#scripts-disponibles)
9. [Pruebas](#pruebas)
10. [Autores](#autores)
11. [Licencia](#licencia)
12. [Contribución](#contribución)

## Descripción
AcadWrite es una plataforma colaborativa que emplea inteligencia artificial para analizar documentos académicos, detectar errores gramaticales, verificar citaciones y prevenir plagio. Su diseño está orientado a elevar la calidad de los trabajos mediante retroalimentación automatizada.

## Características
- API REST con Express.js y Node.js
- Interfaz de usuario con React
- Base de datos MongoDB
- Autenticación de usuarios
- Manejo de variables de entorno con dotenv
- Pruebas unitarias y de integración

## Stack Tecnológico
- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Base de Datos:** MongoDB
- **IA:** OpenAI API + Hugging Face Transformers
- **Automatización:** n8n
- **Contenerización:** Docker

## Requisitos Previos
Antes de comenzar, asegúrate de tener instalados:

- [Node.js](https://nodejs.org/) v16 o superior
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Instalación
Clona este repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/dpalominoj/AcadWrite-RevisorAcademico.git
cd AcadWrite-RevisorAcademico
```

Instala las dependencias en el backend y frontend:
```bash
# Backend
cd src/backend && npm install

# Frontend
cd src/frontend && npm install
```

## Ejecución del Proyecto
Ejecutar backend:

```bash
cd src/backend
npm run dev
```

Ejecutar frontend:

```bash
cd src/frontend
npm start
```

## Estructura del Proyecto

```bash
acadwrite/
├── documentos/
├── src/
│   ├── frontend/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── public/
│   ├── backend/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   ├── n8n-automation/
│   └── ai-components/
├── config/
├── tests/
├── .github/
├── docker-compose.yml
└── package.json
```

## Scripts Disponibles

### Backend
- `npm run dev`: Ejecuta el servidor en modo desarrollo.
- `npm run start`: Ejecuta el servidor en producción.
- `npm run test`: Ejecuta las pruebas.

### Frontend
- `npm start`: Ejecuta la app en modo desarrollo.
- `npm run build`: Genera la versión de producción.
- `npm test`: Ejecuta pruebas.

## Pruebas
Para correr pruebas en backend o frontend:

```bash
npm run test
```

## Autores
[Autor 1]
[Autor 2]
[Autor 3]
[Autor 4]
[Autor 5]
[Autor 6]
[Autor 7]

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más información.

---

### Contribución
¡Tu apoyo es bienvenido! Si quieres contribuir

1. Haz un fork del proyecto.
2. Crea una rama para tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza un commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin feature/nueva-funcionalidad`).
5. Crea un Pull Request.
