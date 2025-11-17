import express from "express";
import registroCivilService from "../Services/registro_civil.service.js";

const router = express.Router();

router.use("/registro_civil", registroCivilService);

export default router;