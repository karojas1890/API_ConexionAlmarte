import express from "express";
import { crearCita,obtenerDisponibilidad,ObtenerServicios,obtenerCitasPendientes } from "../Libraries/Citas.library.js";

const router = express.Router();


router.post("/CrearCita", async (req, res) => {
  try {
    await crearCita(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


router.get("/Servicios", async (req, res) => {
  try {
    await ObtenerServicios(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/CitasPendientes", async (req, res) => {
  try {
    await obtenerCitasPendientes(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/Disponibilidad", async (req, res) => {
  try {
    await obtenerDisponibilidad(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;