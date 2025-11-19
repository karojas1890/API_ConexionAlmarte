import express from "express";
import { ObtenerRecomendacion,ObtenerHistorialHerramientas,ObtenerRecomendacionesTools,GuardarUso } from "../Libraries/herramientas.library.js";

const router = express.Router();

router.get("/Recomendaciones", async (req, res) => {
  try {
    await ObtenerRecomendacion(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/Historial", async (req, res) => {
  try {
    await ObtenerHistorialHerramientas(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/RecomendacionesTools", async (req, res) => {
  try {
    await ObtenerRecomendacionesTools(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/GuardarUso", async (req, res) => {
  try {
    await GuardarUso(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


export default router;