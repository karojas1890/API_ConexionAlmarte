import express from "express";
import { ObtenerEmociones,ObtenerAfrontamiento,ObtenerDiario,ObtenerRecomendaciones,GuardarEvento } from "../Libraries/diary.library.js";

const router = express.Router();


router.post("/GuardarEvento", async (req, res) => {
  try {
    await GuardarEvento(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


router.get("/Emociones", async (req, res) => {
  try {
    await ObtenerEmociones(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/Afrontamiento", async (req, res) => {
  try {
    await ObtenerAfrontamiento(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/Diario", async (req, res) => {
  try {
    await ObtenerDiario(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});
router.get("/Recomendaciones", async (req, res) => {
  try {
    await ObtenerRecomendaciones(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;