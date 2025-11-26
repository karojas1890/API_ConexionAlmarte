import { Disponibilidad } from "../Models/Disponibilidad.model.js";
import { Servicios } from "../Models/Servicios.model.js";
import { sequelize } from "../Data/database.js";
import emailService from "../Services/email.service.js";
import { registrarAuditoria } from "../Services/auditoria.service.js";

// --- Crear Cita ---
export async function crearCita(req, res) {
  try {
    const data = req.body;

    // Validar campos obligatorios
    const requiredFields = ["usuario", "servicio", "iddisponibilidad", "paciente", "correoPaciente", "terapeutaNombre", "terapeutaApellido", "correoTerapeuta"];
    const missing = requiredFields.filter(f => !data[f]);
    if (missing.length) {
      return res.status(400).json({ error: `Faltan datos obligatorios: ${missing.join(", ")}` });
    }

    const estado = data.estado ?? 0;
    const pago = data.pago ?? 1;

    // Llamar al stored procedure
    await sequelize.query(
      `CALL insertarCita(:usuario, :servicio, :iddisponibilidad, :pago, :estado)`,
      {
        replacements: {
          usuario: data.usuario,
          servicio: data.servicio,
          iddisponibilidad: data.iddisponibilidad,
          pago,
          estado
        }
      }
    );

    // Obtener disponibilidad
    const disponibilidad = await Disponibilidad.findByPk(data.iddisponibilidad);
    if (!disponibilidad) {
      return res.status(201).json({ message: "Cita creada, pero no se encontró la disponibilidad." });
    }
    console.log(disponibilidad)
    // Obtener servicio
    const servicioObj = await Servicios.findByPk(data.servicio);
    if (!servicioObj) {
      return res.status(404).json({ message: "Servicio no encontrado." });
    }
    const nombreservicio = servicioObj.nombreservicio;
    console.log(disponibilidad,data.correoPaciente,data.correoTerapeuta,nombreservicio)
    // Enviar correos
    await emailService.SendNewAppointment({
      mail: data.correoTerapeuta,
      pacient: data.paciente,
      date: `${disponibilidad.fecha} de ${disponibilidad.horainicio} a ${disponibilidad.horafin}`,
      nombreServicio: nombreservicio
    });

    await emailService.SendNewAppointmentPacient({
      mail: data.correoPaciente,
      pacient: data.paciente,
      date: `${disponibilidad.fecha} de ${disponibilidad.horainicio} a ${disponibilidad.horafin}`,
      nombreServicio: nombreservicio,
      nombreTerapeuta: `${data.terapeutaNombre} ${data.terapeutaApellido}`
    });

    // Registrar auditoría
    await registrarAuditoria({
      identificacion_consultante: data.usuario,
      tipo_actividad: 2,
      descripcion: "Cita reservada",
      datos_modificados: { servicio: data.servicio, hora: `${disponibilidad.fecha} de ${disponibilidad.horainicio} a ${disponibilidad.horafin}` },
      exito: true
    });
    return res.status(201).json({
      message: "Cita creada exitosamente",
      cita: {
        usuario: data.usuario,
        servicio: data.servicio,
        iddisponibilidad: data.iddisponibilidad,
        estado,
        pago
      }
    });

  } catch (error) {
    console.error("Error crearCita:", error);
    return res.status(500).json({ error: error.message });
  }
}

// --- Obtener Disponibilidad ---
export async function obtenerDisponibilidad(req, res) {
  try {
    const [result] = await sequelize.query("SELECT * FROM ObtenerDisponibilidades()");

    const data = result
      .filter(row => row.estado === 1)
      .map(row => ({
        id: row.iddisponibilidad,
        fecha: row.fecha ? new Date(row.fecha).toISOString().split("T")[0] : null,  
        horainicio: row.horainicio ? row.horainicio.substring(0,5) : null,          
        horafin: row.horafin ? row.horafin.substring(0,5) : null,
        estado: row.estado,
        id_terapeuta: row.idterapeuta
      }));

    return res.json(data);
  } catch (error) {
    console.error("Error obtenerDisponibilidad:", error);
    return res.status(500).json({ error: error.message });
  }
}

// --- Obtener Servicios ---
export async function ObtenerServicios(req, res) {
  try {
    const [result] = await sequelize.query("SELECT * FROM ObtenerServicios()");

    const servicios = result.map(row => ({
      idservicio: row.idservicio,
      nombreservicio: row.nombreservicio,
      descripcionservicio: row.descripcionservicio,
      urlimagen: row.urlimagen ? `/static/images/${row.urlimagen}` : "",
      duracionHoras: row.duracionhoras,
      precio: row.precio ? parseFloat(row.precio) : null
    }));

    return res.json(servicios);
  } catch (error) {
    console.error("Error obtenerServicios:", error);
    return res.status(500).json({ error: error.message });
  }
}

// Obtener Citas Pendientes
export async function obtenerCitasPendientes(req, res) {
  try {
    const idUsuario = req.query.idUsuario;
    if (!idUsuario) {
      return res.status(401).json({ error: "No hay usuario en sesión" });
    }

    const [result] = await sequelize.query(
      "SELECT * FROM obtenerCitasUsuario(:usuario)",
      { replacements: { usuario: idUsuario } }
    );

    const citas = result.map(row => ({
      nombreservicio: row.nombreservicio,
      fecha: row.fecha ? new Date(row.fecha).toISOString().split("T")[0] : null,  // YYYY-MM-DD
      horainicio: row.horainicio ? row.horainicio.substring(0,5) : null,
      nombre_terapeuta: row.nombre_terapeuta,
      apellido1_terapeuta: row.apellido1_terapeuta,
      apellido2_terapeuta: row.apellido2_terapeuta,
      estado: row.estado
    }));

    return res.status(200).json(citas);
  } catch (error) {
    console.error("Error obtenerCitasPendientes:", error);
    return res.status(500).json({ error: error.message });
  }
}
