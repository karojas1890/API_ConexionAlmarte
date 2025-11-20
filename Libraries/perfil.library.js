import {sequelize} from "../Data/database.js";
import { QueryTypes } from "sequelize";




export async function ObtenerPerfil(req, res) {
  try {
    const id_usuario  = req.query.id_usuario 
    if (!id_usuario) {
      return res.status(401).json({ error: "No hay usuario en sesión" });
    }

    const result = await sequelize.query(
      "SELECT * FROM obtenerPerfilPacientePorUsuario(:idusuario)",
      {
        replacements: { idusuario: id_usuario },
        type: QueryTypes.SELECT
      }
    );

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No se encontró el perfil" });
    }

    const row = result[0];

    const perfil = {
      identificacion: row.identificacion,
      nombre: row.nombre,
      apellido1: row.apellido1,
      apellido2: row.apellido2,
      telefono: row.telefono,
      correo: row.correo,
      provincia: row.provincia,
      canton: row.canton,
      distrito: row.distrito,
      direccionexacta: row.direccionexacta,
      fechanacimiento: row.fechanacimiento
        ? new Date(row.fechanacimiento).toISOString()
        : null,
      edad: row.edad,
      ocupacion: row.ocupacion,
      lugartrabajoestudio: row.lugartrabajoestudio,
      urlimagen: row.urlimagen
    };

    return res.status(200).json(perfil);

  } catch (err) {
    console.error("[ERROR ObtenerPerfil]:", err);
    return res.status(500).json({ error: String(err) });
  }
}

export async function GuardarPerfil(req, res) {
  const t = await sequelize.transaction(); 

  try {
    let data = req.body;
    

    // Convertir fecha
    if (data.fechanacimiento) {
      data.fechanacimiento = new Date(data.fechanacimiento);
    } else {
      data.fechanacimiento = null;
    }

    // Convertir edad
    data.edad = data.edad ? parseInt(data.edad) : null;

    // Valores vacíos -> null
    ["direccionexacta", "urlimagen"].forEach(key => {
      if (!data[key]) data[key] = null;
    });

    // Ejecutar procedure
    await sequelize.query(
      `
      CALL actualizarperfilpaciente(
        :identificacion,
        :nombre,
        :apellido1,
        :apellido2,
        :telefono,
        :correo,
        :provincia,
        :canton,
        :distrito,
        :direccionexacta,
        :fechanacimiento,
        :edad,
        :ocupacion,
        :lugartrabajoestudio,
        :urlimagen
      )
      `,
      {
        replacements: data,
        transaction: t
      }
    );

    await t.commit();

    // Actualizar sesión
    req.session.nombre = data.nombre;
    req.session.apellido1 = data.apellido1;
    req.session.correo = data.correo;

    return res.status(200).json({ success: true });

  } catch (err) {
    await t.rollback();
    console.error("Error al guardar perfil:", err);
    return res.status(500).json({ error: String(err) });
  }
}