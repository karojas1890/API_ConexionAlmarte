import express from "express";
import { AddCard,GetCards,DeleteCard} from "../Libraries/cards.library.js";

const router = express.Router();

router.get("/VerTarjetas", async (req, res) => {
  try {
    await GetCards(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/AgregarTarjeta", async (req, res) => {
  try {
    await AddCard(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.delete("/EliminarTarjeta", async (req, res) => {
  try {
    await DeleteCard(req, res);
  } catch (error) {
    console.error("AUTH ROUTE ERROR:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;