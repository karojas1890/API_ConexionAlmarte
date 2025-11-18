import express from "express";
import router from "./Routes/routes.js";
import { conectarDB } from "./Data/database.js";
import { applyRelations } from "./Data/relations.js";
import emailService from "./Services/email.service.js";
const app = express();
app.use(express.json());

app.use("/api", router);


emailService.init(app);
conectarDB();
applyRelations ();//arranca la relaciones
app.listen(3000, () => {
  console.log("🚀 API de Almarte corriendo en http://localhost:3000");
});