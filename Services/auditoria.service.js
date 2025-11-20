import {Auditoria} from "../Models/auditoria.model.js";
import axios from "axios";


export async function registrarAuditoria({
    identificacion_consultante,
    tipo_actividad,
    descripcion,
    codigo = null,
    datos_modificados = null,
    exito = true,
    ip,
    dispositivo = "No identificado"
}) {
    try {
        if (!ip) ip = "0.0.0.0";

        //Obtiene la ubicacion usando el IP 
        let ubicacion = "Desconocida";
        try {
            const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 3000 });
            if (response.data?.status === "success") {
                ubicacion = [response.data.city, response.data.regionName, response.data.country]
                            .filter(Boolean)
                            .join(", ");
            }
        } catch {
            ubicacion = "Ubicación desconocida";
        }

        // Convierte los datos modificados
        if (datos_modificados && typeof datos_modificados === "object") {
            datos_modificados = JSON.stringify(datos_modificados);
        }

        await Auditoria.create({
            identificacion_consultante,
            tipo_actividad,
            descripcion,
            codigo,
            ip_origen: ip,
            dispositivo,     
            ubicacion,
            datos_modificados,
            exito
        });

    } catch (err) {
        console.error("[ERROR AUDITORIA]:", err);
    }
}
