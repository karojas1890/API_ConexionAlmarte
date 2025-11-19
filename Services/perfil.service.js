import express from "express";
import { ObtenerPerfil,GuardarPerfil } from "../Libraries/perfil.library.js";

const router = express.Router();

router.get("/ObtenerPerfil", async (req, res) => {
  try {
    await ObtenerPerfil(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.put("/EditarPerfil", async (req, res) => {
  try {
    await GuardarPerfil(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;