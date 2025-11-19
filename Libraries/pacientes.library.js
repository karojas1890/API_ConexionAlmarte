import { Consultante } from "../Models/Consultante.model.js";
import { Citas } from "../Models/citas.model.js";
import { Disponibilidad } from "../Models/Disponibilidad.model.js";
import {sequelize} from "../Data/database.js";

export async function VerPacientes(req, res) {
  try {
    const pacientes = await Consultante.findAll({
      attributes: [
        "identificacion",
        "nombre",
        "apellido1",
        "apellido2",
        "edad",
        "correo",
        "telefono",
        [
          sequelize.fn("MAX", sequelize.col("citas.citaid")),
          "ultima_cita_id"
        ]
      ],
      include: [
        {
          model: Citas,
          as: "citas",
          attributes: []
        }
      ],
      group: [
        "Consultante.identificacion",
        "Consultante.nombre",
        "Consultante.apellido1",
        "Consultante.apellido2",
        "Consultante.edad",
        "Consultante.correo",
        "Consultante.telefono"
      ]
    });

    const data = [];

    for (const p of pacientes) {
      let ultima_cita_str = "Sin cita";
      let sesiones_completadas = 0;

      const ultimaCitaId = p.getDataValue("ultima_cita_id");

      if (ultimaCitaId) {
        const cita = await Citas.findByPk(ultimaCitaId);

        if (cita) {
          const disponibilidad = await Disponibilidad.findByPk(
            cita.iddisponibilidad
          );

          if (disponibilidad) {
            const fecha = new Date(disponibilidad.fecha);
            ultima_cita_str = fecha.toLocaleDateString("es-CR");
          }
        }
      }

      data.push({
        id: p.identificacion,
        nombre: `${p.nombre} ${p.apellido1} ${p.apellido2 || ""}`,
        edad: p.edad,
        correo: p.correo,
        telefono: p.telefono,
        ultima_cita: ultima_cita_str,
        sesiones: sesiones_completadas
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("[ERROR VerPacientes]:", err);
    return res.status(500).json({ error: "No se pudieron cargar los pacientes." });
  }
}

export async function HistorialCitas(req, res) {
  try {
    
    const identificacion  = req.query.identificacion 
    const result = await Citas.findAll({
      where: { usuario: identificacion },
      order: [["citaid", "DESC"]],
      limit: 10
    });

    const data = await Promise.all(
      result.map(async (c) => {
        let disponibilidad = await Disponibilidad.findByPk(c.iddisponibilidad);

        return {
          id: c.citaid,
          servicio: c.servicio,
          disponibilidad: c.iddisponibilidad,
          estado:
            c.estado === 0
              ? "Pendiente"
              : c.estado === 1
              ? "Finalizada"
              : c.estado === 2
              ? "Cancelada x Terapeuta"
              : "Cancelada x Consultante",
          pago: c.pago === 1 ? "Pendiente" : "Realizado"
        };
      })
    );

    return res.status(200).json(data);

  } catch (err) {
    console.error("[ERROR HistorialCitas]:", err);
    return res.status(500).json({ error: err.message });
  }
}