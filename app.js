import express from "express";
import router from "./Routes/routes.js";
import { conectarDB } from "./Data/database.js";
import { applyRelations } from "./Data/relations.js";
import emailService from "./Services/email.service.js";
import session from "express-session";
const app = express();
app.use(express.json());



app.use(session({
    name: "sessionId",              
    secret: "9a8c7e4f1d2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", 
    resave: false,                   
    saveUninitialized: false,        
    cookie: {
        httpOnly: true,             
        maxAge: 1000 * 60 * 30      
    }
}));

app.use("/api", router);

emailService.init(app);
conectarDB();
applyRelations ();//arranca la relaciones
app.listen(3000, () => {
  console.log("🚀 API de Almarte corriendo en http://localhost:3000");
});