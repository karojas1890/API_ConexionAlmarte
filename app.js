import express from "express";
//import dotenv from "dotenv";
import session from "express-session";

import router from "./routes/routes.js";
import { conectarDB } from "./Data/database.js";
import { applyRelations } from "./Data/relations.js";
import emailService from "./Services/email.service.js";

// Cargar variables de entorno
//dotenv.config();

const app = express();
app.use(express.json());

// Configuración de sesión (solo si la necesitas localmente)
app.use(session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET || "clave_local_temporal", 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

// Inicializar EmailService
emailService.init();

// Conectar a la base de datos
conectarDB();

// Aplicar relaciones de Sequelize
applyRelations();

// Rutas
app.use("/api", router);

// Puerto

app.listen(3000, () => {
  console.log("🚀 API de Almarte corriendo en http://localhost:3000");
});