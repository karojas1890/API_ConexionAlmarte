import { sequelize } from "../Data/database.js";
import { QueryTypes } from "sequelize";


// Obtener recomendaciones 

export async function ObtenerRecomendacionesTools(req, res) {
    try {
         const id_usuario  = req.query.id_usuario 
        if (!id_usuario) {
            return res.status(401).json({ error: "No hay usuario en sesión" });
        }

        const sql = `
            SELECT * FROM obtenerRecomendacionesPorUsuario(:idusuario)
        `;

        const result = await sequelize.query(sql, {
            replacements: { idusuario: id_usuario },
            type: QueryTypes.SELECT
        });

        const recomendaciones = result.map(row => ({
            idasignacion: row.idasignacion,
            idrecomendacion: row.idrecomendacion,
            nombrerecomendacion: row.nombrerecomendacion,
            descripcion: row.descripcion,
            urlimagen: row.urlimagen ? `/static/images/${row.urlimagen}` : "",
            duraciondias: row.duraciondias,
            momento: row.momento,
            nombrecategoria: row.nombrecategoria
        }));

        return res.json(recomendaciones);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}


//Registrar uso 

export async function GuardarUso(req, res) {
    try {
        const data = req.body;

        
        const id_usuario = data.id_usuario;

        if (!id_usuario) {
            return res.status(400).json({
                success: false,
                error: "Falta id_usuario en el body"
            });
        }

        const sql = `
            CALL insertarRegistroHerramienta(
                :p_idUsuario,
                :p_idasignacion,
                :p_efectividad,
                :p_animoAntes,
                :p_animoDespues,
                :p_bienestarAntes,
                :p_bienestarDespues,
                :p_comentario
            )
        `;

        await sequelize.query(sql, {
            replacements: {
                p_idUsuario: id_usuario,
                p_idasignacion: data.idasignacion,
                p_efectividad: data.efectividad,
                p_animoAntes: data.animoAntes,
                p_animoDespues: data.animoDespues,
                p_bienestarAntes: data.bienestarAntes,
                p_bienestarDespues: data.bienestarDespues,
                p_comentario: data.comentario
            }
        });

        return res.json({ success: true });

    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
}


// Obtener recomendacion por asignacion

export async function ObtenerRecomendacion(req, res) {
    try {
    
         const id_asignacion  = req.query.id_asignacion
        const sql = `
            SELECT * 
            FROM ObtenerRecomendacionPorAsignacion(:idasignacion)
        `;

        const result = await sequelize.query(sql, {
            replacements: { idasignacion: id_asignacion },
            type: QueryTypes.SELECT
        });

        if (result.length === 0) {
            return res.status(404).json({ error: "Recomendación no encontrada" });
        }

        const row = result[0];

        return res.json({
            idAsignacion: row.idasignacion,
            duracionDias: row.duraciondias,
            momento: row.momento,
            nombreRecomendacion: row.nombrerecomendacion,
            descripcion: row.descripcion,
            urlimagen: row.urlimagen || "",
            duracionMinutos: row.duracionminutos,
            categoria: row.nombrecategoria,
            descripcionCategoria: row.descripcioncategoria
        });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}


// Historial de herramientas

export async function ObtenerHistorialHerramientas(req, res) {
    try {
        const id_usuario  = req.query.id_usuario 

        if (!id_usuario) {
            return res.status(401).json({ error: "Usuario no logueado" });
        }

        const sql = `
            SELECT * FROM obtenerRegistrosAplicacion(:p_idusuario)
        `;

        const result = await sequelize.query(sql, {
            replacements: { p_idusuario: id_usuario },
            type: QueryTypes.SELECT
        });

        const registros = result.map(row => ({
            idregistro: row.idregistro,
            idasignacion: row.idasignacion,
            efectividad: row.efectividad,
            animoantes: row.animoantes,
            animodespues: row.animodespues,
            bienestarantes: row.bienestarantes,
            bienestardespues: row.bienestardespues,
            comentario: row.comentario,
            fechahoraregistro: row.fechahoraregistro,
            nombrerecomendacion: row.nombrerecomendacion,
            nombrecategoria: row.nombrecategoria
        }));

        return res.json(registros);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
