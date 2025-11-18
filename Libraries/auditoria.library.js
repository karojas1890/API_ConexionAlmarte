import { Auditoria } from "../Models/auditoria.model.js";
import { sequelize } from "../Data/database.js";

export async function obtenerAuditorias(req, res) {
    try {
        const registros = await Auditoria.findAll({
            order: [["fecha", "DESC"]]
        });

        const data = registros.map(row => ({
            id_actividad: row.id_actividad,
            identificacion_consultante: row.identificacion_consultante,
            tipo_actividad: row.tipo_actividad,
            descripcion: row.descripcion,
            codigo: row.codigo,
            fecha: row.fecha?.toISOString().replace("T", " ").substring(0, 19),
            ip_origen: row.ip_origen,
            dispositivo: row.dispositivo,
            ubicacion: row.ubicacion,
            datos_modificados: row.datos_modificados,
            exito: row.exito
        }));

        return res.json(data);

    } catch (error) {
        console.error("[ERROR AUDITORIA]:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

export async function obtenerAuditoriaUsuario(req, res) {
    try {
        const idusuario  = req.body;

        if (!idusuario) {
            return res.status(400).json({ error: "Debe enviar el idusuario" });
        }

        const query = "SELECT * FROM obtener_auditoria_usuario(:id)";
        const result = await sequelize.query(query, {
            replacements: { id: idusuario },
            type: sequelize.QueryTypes.SELECT
        });

        return res.status(200).json({ data: result ?? [] });

    } catch (error) {
        console.error("Error obteniendo auditoría:", error);
        return res.status(500).json({ error: "Error al obtener datos de auditoría" });
    }
}