import express from "express";
import { login,verificarCodigo,logout } from "../Libraries/auth.library.js";

const router = express.Router();


router.post("/login", async (req, res) => {
  try {
    await login(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/verificarCodigo", async (req, res) => {
  try {
    await verificarCodigo(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    await logout(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});


export default router;
