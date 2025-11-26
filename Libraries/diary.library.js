import { sequelize } from "../Data/database.js"; 
import { registrarAuditoria } from "../Services/auditoria.service.js";

// Obtener emociones
export async function ObtenerEmociones(req, res) {
  try {
    const [result] = await sequelize.query("SELECT * FROM obteneremociones()");
    const emociones = result.map(row => ({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion
    }));
    res.status(200).json(emociones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Obtener afrontamiento
export async function ObtenerAfrontamiento(req, res) {
  try {
    const [result] = await sequelize.query("SELECT * FROM obtenerafrontamiento()");
    const conductas = result.map(row => ({
      id: row.id,
      nombre: row.nombre_conducta,
      descripcion: row.descripcion_conducta
    }));
    res.status(200).json(conductas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// btener diario
export async function ObtenerDiario(req, res) {
  try {
    // Se toma el id del cuerpo de la consulta
   
    const idusuario = req.query.idusuario;
    if (!idusuario) {
      return res.status(400).json({ error: "Falta el idusuario en la solicitud" });
    }

    // Se la funcion de PostgreSQL
    const registros = await sequelize.query(
      "SELECT * FROM obtenerdiariocondetallesporusuario(:idusuario)",
      {
        replacements: { idusuario },
        type: sequelize.QueryTypes.SELECT, 
      }
    );

    // Separa avances y disparadores segun tiporegistro
    const avances = registros.filter(r => r.tiporegistro === 1);
    const disparadores = registros.filter(r => r.tiporegistro === 0);

    // Devuelve la respuesta
    res.status(200).json({ avances, disparadores });
  } catch (err) {
    console.error("Error en ObtenerDiario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
// Obtener recomendaciones 
export async function ObtenerRecomendaciones(req, res) {
  try {
    const idusuario = req.query.idusuario;

    if (!idusuario) {
      return res.status(400).json({ error: "Falta el idusuario en la solicitud" });
    }

    const result = await sequelize.query(
      "SELECT * FROM obtenerrecomendacionesdiario(:idusuario)",
      {
        replacements: { idusuario },
        type: sequelize.QueryTypes.SELECT, // ya devuelve array de objetos
      }
    );

    const recomendaciones = result.map(row => ({
      idasignacion: row.idasignacion,
      idrecomendacion: row.idrecomendacion,
      nombre: row.nombre,
      descripcion: row.descripcion,
      urlimagen: row.urlimagen,
      duracionminutos: row.duracionminutos,
      duraciondias: row.duraciondias,
      momento: row.momento
    }));

    res.status(200).json(recomendaciones);
  } catch (err) {
    console.error("Error en ObtenerRecomendaciones:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
export async function GuardarEvento(req, res) {
  const t = await sequelize.transaction();
  try {
    const data = req.body;

    if (!data.situacion || !data.emocion_id || !data.afrontamiento_id || !data.estrategia_id)
      return res.status(400).json({ error: "Faltan datos obligatorios" });

    await sequelize.query(
      `CALL insertarDiario(
        :p_idusuario,
        :p_tiporegistro,
        :p_descripcion,
        :p_emocion,
        :p_conducta,
        :p_idrecomendacion,
        :p_efectividad
      )`,
      {
        replacements: {
          p_idusuario: data.idusuario,
          p_tiporegistro: data.tiporegistro || 0,
          p_descripcion: data.situacion,
          p_emocion: data.emocion_id,
          p_conducta: data.afrontamiento_id,
          p_idrecomendacion: data.estrategia_id,
          p_efectividad: parseInt(data.efectividad || 0)
        },
        transaction: t
      }
    );

    await registrarAuditoria({
      identificacion_consultante: data.idusuario,
      tipo_actividad: 4,
      descripcion: "Registro de Diario",
      entidad_afectada: "diario",
      idafectado: data.idusuario
    }, t);

    await t.commit();
    return res.json({ success: true, message: "Evento guardado correctamente" });

  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
}
