import express from "express";
import { obtenerAuditorias,obtenerAuditoriaUsuario } from "../Libraries/auditoria.library.js";

const router = express.Router();


router.get("/auditoria", async (req, res) => {
  try {
    await obtenerAuditorias(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/audit", async (req, res) => {
  try {
    await obtenerAuditoriaUsuario(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;
