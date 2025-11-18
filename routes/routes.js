import express from "express";
import login from "../Services/auth.service.js";
import auditoria from "../Services/audit.service.js";
import citas from "../Services/cita.service.js";
import credentials from "../Services/credential.service.js";

const router = express.Router();



router.use("/auth", login);

router.use("/audit", auditoria);
router.use("/Citas", citas);
router.use("/Credenciales", credentials);
export default router;