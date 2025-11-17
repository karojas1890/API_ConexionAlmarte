import express from "express";
import router from "./routes/inicio.js";
import { conectarDB } from "./Data/database.js";
import { applyRelations } from "./Data/relations.js";
const app = express();
app.use(express.json());

app.use("/api", router);

conectarDB();
applyRelations ()
app.listen(3000, () => {
  console.log("🚀 API de Almarte corriendo en http://localhost:3000");
});