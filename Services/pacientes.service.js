import express from "express";
import { VerPacientes,HistorialCitas } from "../Libraries/pacientes.library.js";

const router = express.Router();

router.get("/ConsultarPacientes", async (req, res) => {
  try {
    await VerPacientes(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/HistorialCitas", async (req, res) => {
  try {
    await HistorialCitas(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;