import { Tarjeta } from "../Models/Tarjeta.model.js";
import CryptoJS from "crypto-js";

const SECRET = process.env.AES_SECRET;

// Encriptar
export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
}

// Desencriptar
export function decrypt(cipher) {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}



export async function AddCard(req, res) {
  try {
    const { id_usuario, cardNumber, expiryDate, cardHolder } = req.body;

    if (!id_usuario || !cardNumber || !expiryDate || !cardHolder) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos: id_usuario, cardNumber, expiryDate o cardHolder"
      });
    }

    const ultimos4 = cardNumber.slice(-4);

    const numeroCifrado = encrypt(cardNumber);
    const fechaCifrada = encrypt(expiryDate);

    await Tarjeta.create({
      id_usuario,
      nombre_titular: cardHolder,
      ultimo4: ultimos4,
      numero_tarjeta: numeroCifrado,
      fecha_expiracion: fechaCifrada,
      estado: true
    });

    return res.json({
      success: true,
      message: "Tarjeta agregada correctamente"
    });

  } catch (e) {
    console.error("Error agregando tarjeta:", e);
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
}


export async function GetCards  (req, res) {
  try {
    const idusuario  = req.query.idusuario 
    if (!idusuario) {
      return res.status(401).json({ success: false, message: "Usuario no logueado" });
    }

    const tarjetas = await Tarjeta.findAll({
      where: { id_usuario: idusuario }
    });

    const tarjetasData = [];

    for (const t of tarjetas) {
      let fechaDesencriptada = null;

      try {
        if (t.fecha_expiracion) {
          fechaDesencriptada = decrypt(t.fecha_expiracion);
        }
      } catch (err) {
        console.warn(`No se pudo descifrar tarjeta ${t.id_tarjeta}:`, err);
      }

      tarjetasData.push({
        id_tarjeta: t.id_tarjeta,
        nombre_titular: t.nombre_titular,
        ultimo4: t.ultimo4,
        fecha_expiracion: fechaDesencriptada
      });
    }

    return res.json(tarjetasData);

  } catch (e) {
    console.error("Error obteniendo tarjetas:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

export async function DeleteCard(req, res) {
  try {
    const { id_usuario, id_tarjeta } = req.query;

    if (!id_usuario) {
      return res.status(400).json({ success: false, message: "Falta id_usuario" });
    }

    if (!id_tarjeta) {
      return res.status(400).json({ success: false, message: "Falta id_tarjeta" });
    }

    const tarjeta = await Tarjeta.findOne({
      where: { id_tarjeta, id_usuario }
    });

    if (!tarjeta) {
      return res.status(404).json({ success: false, message: "Tarjeta no encontrada" });
    }

    await tarjeta.destroy();

    return res.json({ success: true, message: "Tarjeta eliminada correctamente" });

  } catch (e) {
    console.error("Error eliminando tarjeta:", e);
    return res.status(500).json({ success: false, message: e.message });
  }
}
