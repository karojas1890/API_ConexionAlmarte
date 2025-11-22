import express from "express";
import dotenv from "dotenv";//npm uninstall dotenv npm install dotenv
import session from "express-session";
import cors from "cors";
import router from "./routes/routes.js";
import { conectarDB } from "./Data/database.js";
import { applyRelations } from "./Data/relations.js";
import emailService from "./Services/email.service.js";

// Cargar variables de entorno
dotenv.config();

const app = express();

app.use(cors({
    origin: "https://conexionalmarteparte2.onrender.com", 
    credentials: true,                                     
}));



app.use(express.json());


app.use(session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,          
        sameSite: "none",      
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

// app.listen(PORT, () => {
//   console.log(`🚀 API de Almarte corriendo en el puerto ${PORT}`);
// });
const PORT = process.env.PORT || 3000;

app.listen(PORT);