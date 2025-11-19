import express from "express";
import { GetPais,GetEstado,GetCiudad,GetBarrio } from "../Libraries/geolocalizacion.library.js";

const router = express.Router();


router.get("/Pais", async (req, res) => {
  try {
    await GetPais(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/Estado", async (req, res) => {
  try {
    await GetEstado(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/Barrio", async (req, res) => {
  try {
    await GetBarrio(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/Ciudad", async (req, res) => {
  try {
    await GetCiudad(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;