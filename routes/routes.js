import express from "express";
import login from "../Services/auth.service.js";
import auditoria from "../Services/audit.service.js";
import citas from "../Services/cita.service.js";
import credentials from "../Services/credential.service.js";
import diario from "../Services/diary.service.js";
import Disponibilidad from "../Services/Disponibilidad.service.js";
import geolocalizacion from "../Services/geolocalizacion.service.js";
const router = express.Router();



router.use("/auth", login);

router.use("/audit", auditoria);
router.use("/Citas", citas);
router.use("/Credenciales", credentials);
router.use("/Diario", diario);
router.use("/Disponibilidad", Disponibilidad);
router.use("/Geolocalizacion", geolocalizacion);

export default router;