import bcrypt from "bcrypt";
import {sequelize} from "../Data/database.js";
import { registrarAuditoria } from "../Services/auditoria.service.js";
import emailService from "../Services/email.service.js";
import { Usuario } from "../Models/Usuario.model.js";
// --- Funciones Auxiliares ---
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000); // código 6 dígitos
}

function formatUserResponse(userData) {
    const { password, codigo6digitos, codigo_expiracion, ...publicData } = userData;
    return publicData;
}

async function handleFailedLogin(user, dispositivo, ip) {
    try {
        const newAttempts = (user.intentos || 0) + 1;

        await sequelize.query(
            `UPDATE usuario SET intentos = :intentos WHERE idusuario = :id`,
            { replacements: { intentos: newAttempts, id: user.idusuario } }
        );

        if (newAttempts >= 3) {
            await sequelize.query(
                `UPDATE usuario SET estado = 0 WHERE idusuario = :id`,
                { replacements: { id: user.idusuario } }
            );

            // Registrar en auditoría usuario bloqueado
            await registrarAuditoria({
                identificacion_consultante: user.idusuario,
                tipo_actividad: 7,
                descripcion: "Usuario bloqueado por intentos fallidos",
                exito: false,
                ip,
                dispositivo,
            });
        } else {
            // Registrar intento fallido normal
            await registrarAuditoria({
                identificacion_consultante: user.idusuario,
                tipo_actividad: 7,
                descripcion: "Intento de login fallido",
                exito: false,
                ip,
                dispositivo,
            });
        }
    } catch (error) {
        
    }
}


export async function login(req, res) {
    try {
        const { usuario, password, ip, dispositivo } = req.body;

        // Validar campos obligatorios
        if (!usuario || !password) {
            return res.status(400).json({ success: false, message: "Usuario y contraseña requeridos" });
        }

        // Buscar usuario en DB
        const sqlUser = `
            SELECT idusuario, password, intentos, estado, tipo 
            FROM usuario 
            WHERE usuario=:usuario
        `;
        const [rows] = await sequelize.query(sqlUser, { replacements: { usuario } });
        const user = rows?.[0];

        if (!user) {
            return res.json({ success: false, message: "Usuario o contraseña incorrectos" });
        }

        if (user.estado !== 1) {
            return res.json({ success: false, message: "Usuario bloqueado. Restablezca su contraseña." });
        }

        // Validar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            // Puedes llamar aquí a tu función de auditoría de login fallido
            return res.json({ success: false, message: "Usuario o contraseña incorrectos" });
        }
        if (!validPassword) {
            await handleFailedLogin(user, dispositivo, ip);
            return res.json({ success: false, message: "Usuario o contraseña incorrectos" });
        }

        // Resetear intentos
        await sequelize.query(
            `UPDATE usuario SET intentos = 0 WHERE idusuario = :id`,
            { replacements: { id: user.idusuario } }
        );

        // Obtener datos completos del usuario
        const sqlFunc = `SELECT * FROM loginUsuario(:usuario)`;
        const [userDataRows] = await sequelize.query(sqlFunc, { replacements: { usuario } });
        const userData = userDataRows?.[0];

        if (!userData) {
            return res.status(500).json({ success: false, message: "No se pudo cargar la información del usuario" });
        }

        // Variables de sesión
        req.session.user = {
            idusuario: userData.idusuario,
            tipo: userData.tipo,
            nombre: userData.nombre || "",
            apellido1: userData.apellido1 || "",
            cedula: userData.identificacion_consultante || "",
            correo: userData.consultante_correo || "",
            cedula_terapeuta: userData.identificacion_terapeuta || "",
            terapeuta_nombre: userData.terapeuta_nombre || "",
            terapeuta_apellido1: userData.terapeuta_apellido1 || "",
            correo_terapeuta: userData.terapeuta_correo || ""
        };

        await new Promise((resolve, reject) => {
            req.session.save(err => (err ? reject(err) : resolve()));
        });

        // Determinar correo y nombre para enviar código
        let correoDestino = "";
        let nombreDestino = "";

        if (userData.tipo === 1) { // Consultante
            correoDestino = userData.consultante_correo || "";
            nombreDestino = userData.nombre || "";
        } else if (userData.tipo === 2) { // Terapeuta
            correoDestino = userData.terapeuta_correo || "";
            nombreDestino = userData.terapeuta_nombre || "";
        }

        if (!correoDestino || !nombreDestino) {
            console.error("Datos de correo incompletos:", correoDestino, nombreDestino);
            return res.status(500).json({ success: false, message: "Datos de usuario incompletos para enviar código" });
        }

        // Registrar auditoría login exitoso
        await registrarAuditoria({
            identificacion_consultante: userData.idusuario,
            tipo_actividad: 7,
            descripcion: "Login exitoso",
            exito: true,
            ip,
            dispositivo
        });

        // Generar código de verificación de 6 dígitos
        const verificationCode = generateCode();
        const expirationTime = new Date(Date.now() + 60000);

        await sequelize.query(
            `UPDATE usuario 
             SET codigo6digitos = :codigo, codigo_expiracion = :exp
             WHERE idusuario = :id`,
            { replacements: { codigo: verificationCode, exp: expirationTime, id: userData.idusuario } }
        );

        // Enviar email
        await emailService.SendVerificationCode({
            mail: correoDestino,
            username: nombreDestino,
            code: verificationCode
        });

        // Responder al cliente
        return res.json({
            
            success: true,
            message: "Login exitoso, código de verificación enviado",
            data: formatUserResponse(userData)
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({ success: false, message: "Error interno" });
    }
}


export async function reenviarCodigo(req, res) {
    try {
        const {ip, dispositivo } = req.body;
        const nombre = req.session.nombre;
        const email = req.session.correo
        if (!idusuario || !correo || !nombre) {
            return res.status(400).json({
                success: false,
                message: "No hay datos de sesión, vuelva a iniciar sesión"
            });
        }

        const newCode = generateCode();
        const newExpiration = new Date(Date.now() + 60000);

        //se actualiza usando modelo
        await Usuario.update(
            {
                codigo6digitos: newCode,
                codigo_expiracion: newExpiration
            },
            {
                where: { idusuario }
            }
        );

        // Enviar email
        await emailService.SendVerificationCode({
            mail: email,
            username: nombre,
            code: newCode
        });

        // Registrar auditoría
        await registrarAuditoria({
            identificacion_consultante: idusuario,
            tipo_actividad: 7,
            descripcion: "Reenvío de código de verificación",
            exito: true,
            ip,
            dispositivo
        });

        return res.json({
            success: true,
            message: "Código reenviado exitosamente"
        });

    } catch (error) {
        console.error("REENVIAR CÓDIGO ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error al reenviar código"
        });
    }
}
export async function verificarCodigo(req, res) {
    try {
        const { codigo,idusuario, rol } = req.body; // código ingresado por el usuario
     

        if (!idusuario) {
            return res.status(401).json({
                success: false,
                message: "No hay sesión activa. Por favor, inicie sesión."
            });
        }

        // Obtener usuario y su código de verificación
        const usuario = await Usuario.findOne({
            where: { idusuario },
            attributes: ["codigo6digitos", "codigo_expiracion"]
        });

        if (!usuario) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado." });
        }

        // Verificar expiración
        if (new Date() > usuario.codigo_expiracion) {
            return res.status(400).json({ success: false, message: "El código ha expirado." });
        }

        // Verificar código
        if (codigo !== usuario.codigo6digitos) {
            return res.status(400).json({ success: false, message: "Código incorrecto." });
        }

        // Resetear código y expiración
        await Usuario.update(
            { codigo6digitos: null, codigo_expiracion: null },
            { where: { idusuario } }
        );

        // Registrar auditoría
        await registrarAuditoria({
            identificacion_consultante: idusuario,
            tipo_actividad: 8,
            descripcion: "Código verificado exitosamente",
            exito: true,
            ip: req.body.ip || req.ip,
            dispositivo: req.body.dispositivo || "Desconocido"
        });

        // Redirección según rol
        switch (rol) {
            case 1:
                return res.json({ success: true, redirect: "/dashboard_consultante" });
            case 2:
                return res.json({ success: true, redirect: "/dashboard" });
            case 3:
            case 4:
                return res.json({ success: true, redirect: "/quien_eres" });
            default:
                return res.json({ success: true, redirect: "/" });
        }

    } catch (error) {
        console.error("VERIFICAR CÓDIGO ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Error al verificar código"
        });
    }
}

export function logout(req, res) {
    // Limpiar la sesion
    req.session.destroy(err => {
        if (err) {
            console.error("Error cerrando sesión:", err);
            return res.status(500).send("Error al cerrar sesión");
        }
        // Redirigir al login
        return res.status(200).json({ success: true, message: "Serrando sesion." });
    });
}