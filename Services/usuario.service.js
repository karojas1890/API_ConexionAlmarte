import express from "express";
import { crearUsuarioService} from "../Libraries/Usuario.library.js";

const router = express.Router();


router.post("/CreraUsuario", async (req, res) => {
  try {
    await crearUsuarioService(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;