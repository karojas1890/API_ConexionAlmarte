import express from "express";
import { UpdatePassword,ValidateCode,ValidateSecurityQuestions,ValidarUsuarioRecovery } from "../Libraries/credential.library.js";

const router = express.Router();


router.post("/actualizarContrasena", async (req, res) => {
  try {
    await UpdatePassword(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


router.post("/ValidarCodigo", async (req, res) => {
  try {
    await ValidateCode(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/PreguntasSeguridad", async (req, res) => {
  try {
    await ValidateSecurityQuestions(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/ValidarUsuario", async (req, res) => {
  try {
    await ValidarUsuarioRecovery(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;