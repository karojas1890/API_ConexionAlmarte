import express from "express";
import { obtenerPersonaPorCedula } from "../Libraries/registro_civil.library.js";

const router = express.Router();

// GET /api/registro_civil/:cedula
router.get("/:cedula", async (req, res) => {
  try {
    const persona = await obtenerPersonaPorCedula(req.params.cedula);
    if (!persona) return res.status(404).json({ message: "Persona no encontrada" });
    res.json(persona);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
