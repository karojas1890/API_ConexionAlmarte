import express from "express";
import { AgregarDisponibilidad } from "../Libraries/Disponibilidad.library.js";

const router = express.Router();



router.post("/AgregarDisponibilidad", async (req, res) => {
  try {
    await AgregarDisponibilidad(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;