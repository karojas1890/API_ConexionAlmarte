import { sequelize } from "../Data/database.js";
import { QueryTypes } from "sequelize";

export async function AgregarDisponibilidad(req, res) {
  const t = await sequelize.transaction();
  try {
    const { slots, id_terapeuta } = req.body; 

    if (!id_terapeuta) {
      return res.status(400).json({ error: "Falta la Identificacion del terapeuta" });
    }

    if (!slots || slots.length === 0) {
      return res.status(400).json({ error: "No se enviaron slots" });
    }

    for (const slot of slots) {
      let fecha, hora_inicio, hora_fin;

      // Valida y parsear fechas y horas
      try {
        fecha = new Date(slot.fecha); // YYYY-MM-DD
        const [hiHours, hiMinutes] = slot.hora_inicio.split(":").map(Number);
        const [hfHours, hfMinutes] = slot.hora_fin.split(":").map(Number);

        hora_inicio = new Date(fecha);
        hora_inicio.setHours(hiHours, hiMinutes, 0, 0);

        hora_fin = new Date(fecha);
        hora_fin.setHours(hfHours, hfMinutes, 0, 0);
      } catch (err) {
        return res.status(400).json({ error: `Formato incorrecto en el slot: ${JSON.stringify(slot)}` });
      }

      if (hora_fin <= hora_inicio) {
        return res.status(400).json({ error: `La hora de fin debe ser mayor que la hora de inicio: ${JSON.stringify(slot)}` });
      }

      // Ejecuta el sp
      await sequelize.query(
        "CALL RegistrarDisponibilidad(:fecha, :horainicio, :horafin, :idterapeuta)",
        {
          replacements: {
            fecha: slot.fecha,
            horainicio: slot.hora_inicio,
            horafin: slot.hora_fin,
            idterapeuta:id_terapeuta
          },
          type: QueryTypes.RAW,
          transaction: t
        }
      );
    }

    await t.commit();
    return res.status(200).json({ msg: "Disponibilidades registradas exitosamente" });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ error: err.message });
  }
}
