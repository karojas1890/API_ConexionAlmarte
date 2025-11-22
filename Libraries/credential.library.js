import { Usuario } from "../Models/Usuario.model.js";
import { Consultante } from "../Models/Consultante.model.js";
import { Terapeuta } from "../Models/Terapeuta.model.js";
import { RestriccionPassword } from "../Models/RestriccionPassword.model.js";
import bcrypt from "bcrypt";
import emailService from "../Services/email.service.js";
import { registrarAuditoria } from "../Services/auditoria.service.js";


const normalizeText = text =>
  text?.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase() || "";

const normalizeDate = dateStr => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (!isNaN(date)) return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const dbMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return dbMatch ? dateStr : null;
};



//  Valida el usuario para recuperacion 
export async function ValidarUsuarioRecovery(req, res) {
  try {
    const { usuario: usuario_input, tipo: tipo_recuperacion } = req.body;
    req.session.recovery_tipo = tipo_recuperacion;

    if (!usuario_input) {
      return res.json({ success: false, message: "Usuario requerido" });
    }

    //  Revisar si es consultante
    let consultante = await Consultante.findOne({ where: { correo: usuario_input } });
    if (consultante) {
      let usuario = await Usuario.findByPk(consultante.idusuario);
      if (!usuario) {
        return res.json({ success: false, message: "Error: Usuario no encontrado" });
      }

      if (usuario.estado !== 1 && tipo_recuperacion !== "1") {
        req.session.recovery_estado = usuario.estado;
        return res.json({
          success: false,
          message:
            'Usuario bloqueado. Para reactivar tu cuenta, por favor utiliza la opción de "Recuperar Contraseña".',
        });
      }

      // Guardar datos en sesión
      req.session.recovery_tipo_usuario = "consultante";
      req.session.recovery_idusuario = usuario.idusuario;
      req.session.recovery_identificacion = consultante.identificacion;
      req.session.recovery_tipo = tipo_recuperacion;
      req.session.recovery_correo = consultante.correo;
      req.session.recovery_nombre = consultante.nombre;
      req.session.recovery_estado = usuario.estado;
      req.session.recovery_usuario = usuario.usuario;
      req.session.recovery_date = consultante.fechanacimiento;
      req.session.recovery_canton = consultante.canton;
      req.session.recovery_phone = consultante.telefono;

      return res.json({ success: true, message: "Usuario validado correctamente", tipo: 1 });
    }

    // --- Revisar si es terapeuta ---
    let terapeuta = await Terapeuta.findOne({ where: { correo: usuario_input } });
    if (terapeuta) {
      let usuario = await Usuario.findByPk(terapeuta.idusuario);
      if (!usuario) {
        return res.json({ success: false, message: "Error: Usuario no encontrado" });
      }

      if (usuario.estado !== 1 && tipo_recuperacion !== "1") {
        req.session.recovery_estado = usuario.estado;
        return res.json({
          success: false,
          message:
            'Usuario bloqueado. Para reactivar tu cuenta, por favor utiliza la opción de "Recuperar Contraseña".',
        });
      }

      // Guardar datos en sesión
      req.session.recovery_tipo_usuario = "terapeuta";
      req.session.recovery_idusuario = usuario.idusuario;
      req.session.recovery_identificacion = terapeuta.identificacion;
      req.session.recovery_tipo = tipo_recuperacion;
      req.session.recovery_correo = terapeuta.correo;
      req.session.recovery_nombre = terapeuta.nombre;
      req.session.recovery_estado = usuario.estado;
      req.session.recovery_usuario = usuario.usuario;
      req.session.recovery_codigoprofesional = terapeuta.codigoprofesional;
      req.session.recovery_apellido = terapeuta.apellido2;

      return res.json({ success: true, message: "Usuario validado correctamente", tipo: 2 });
    }

    //No existe 
    return res.json({
      success: false,
      message: "El correo electrónico no está asociado a ningún usuario.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}


export async function ValidateSecurityQuestions(req, res) {
  try {
    const { question1, answer1, tipouss } = req.body;
    const tipoUsuario = req.session.user?.tipo;

    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Sesión expirada o usuario no autenticado."
      });
    }

    // ID del consultante o terapeuta extraído de sesión
    const identificacion =
      tipoUsuario === 2
        ? req.session.user.cedula_terapeuta
        : req.session.user.cedula_consultante || req.session.user.cedula;

    if (!identificacion) {
      return res.status(400).json({
        success: false,
        message: "Identificación no disponible en sesión."
      });
    }

    // Inicializar contador de intentos
    if (!req.session.failed_attempts) req.session.failed_attempts = 0;

    let isValid = false;

    

  
    if (tipoUsuario === 1 || tipoUsuario === 3 || tipoUsuario === 4) {
      if (question1 === "id_digits") {
        isValid = answer1 === identificacion.slice(-3);

      } else if (question1 === "birthdate") {
        isValid = normalizeDate(answer1) === normalizeDate(req.session.user.birthdate);

      } else if (question1 === "canton") {
        isValid = normalizeText(answer1) === normalizeText(req.session.user.canton);

      } else if (question1 === "phone_digits") {
        isValid = answer1 === String(req.session.user.telefono).slice(-3);
      }

    
    } else if (tipoUsuario === 2) {
      if (question1 === "id_digits") {
        isValid = answer1 === identificacion.slice(-3);

      } else if (question1 === "M_last_name") {
        isValid =
          normalizeText(answer1) ===
          normalizeText(req.session.user.terapeuta_apellido1);

      } else if (question1 === "code") {
        isValid = answer1 === String(req.session.user.codigo_profesional).slice(-3);
      }

    } else {
      return res.status(400).json({
        success: false,
        message: "Tipo de usuario no válido."
      });
    }

    
    if (!isValid) {
      req.session.failed_attempts++;

      if (req.session.failed_attempts >= 3) {
        return res.json({
          success: false,
          blocked: true,
          message: "Máximo de intentos alcanzado. Espera 24h."
        });
      }

      return res.json({
        success: false,
        blocked: false,
        attempts: req.session.failed_attempts,
        message: "Respuesta incorrecta."
      });
    }

 
    req.session.security_verified = true;
    delete req.session.failed_attempts;

    const usuarioDB = await Usuario.findByPk(req.session.user.idusuario);

    if (!usuarioDB) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado en la base de datos."
      });
    }

    // Genera un codigo de 6 dígitos
    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
    usuarioDB.codigo6digitos = code;
    await usuarioDB.save();

    // Seleccionar correo correcto
    const correoDestino =
      tipoUsuario === 2
        ? req.session.user.correo_terapeuta
        : req.session.user.correo;

    await emailService.SendVerificationCodeCredentials({
      email: correoDestino,
      username: req.session.user.nombre,
      code
    });

    return res.json({
      success: true,
      message: "Respuesta correcta. Código enviado al correo registrado."
    });

  } catch (err) {
    console.error("Error ValidateSecurityQuestions:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
}

// Valida el codigo 
export async function ValidateCode(req, res) {
  try {
    const { code,idusuario,tipo_recuperacion} = req.body;
    

    const usuario = await Usuario.findByPk(idusuario);
    if (!usuario) return res.json({ success: false, message: "Usuario no encontrado" });

    if (usuario.codigo6digitos !== code) return res.json({ success: false, message: "Código incorrecto" });

    usuario.codigo6digitos = null;
    await usuario.save();

    if (tipo_recuperacion === "1") {
      req.session.code_verified = true;
      return res.json({ success: true, typw: "1", redirect_url: "/restablecer_contra" });
    } else if (tipo_recuperacion === "2") {
      req.session.code = code;
      await emailService.SendUsernameReminder({ email: req.session.recovery_correo, uss: usuario.usuario });
      await registrarAuditoria({
        identificacion_consultante: req.session.recovery_idusuario,
        tipo_actividad: 9,
        descripcion: "Recuperación de usuario",
        codigo: code,
        datos_modificados: { hora: new Date() },
        exito: true
      });
      return res.json({ success: true, typw: "2", redirect_url: "/login", message: `Nombre de usuario enviado a ${req.session.recovery_correo}` });
    }

    return res.json({ success: false, message: "Tipo de recuperación inválido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}

// Actualiza la contrasena
export async function UpdatePassword(req, res) {
  try {
   
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6)
      return res.json({ success: false, message: "La contraseña debe tener al menos 6 caracteres" });

    const idusuario = req.session.recovery_idusuario;
    const usuario = await Usuario.findByPk(idusuario);
    if (!usuario) return res.json({ success: false, message: "Usuario no encontrado" });

    const historial = await RestriccionPassword.findAll({
      where: { idusuario },
      order: [["fecha_registro", "DESC"]],
      limit: 6
    });

    for (const registro of historial) {
      if (await bcrypt.compare(new_password, registro.password_hash)) {
        return res.status(400).json({ success: false, message: "No puede usar las últimas 6 contraseñas" });
      }
    }

    usuario.password = await bcrypt.hash(new_password, 10);
    if (usuario.estado === 0) {
      usuario.estado = 1;
      usuario.intentos = 0;
    }
    await usuario.save();

    await registrarAuditoria({
      identificacion_consultante: idusuario,
      tipo_actividad: 10,
      descripcion: "Cambio de contraseña",
      codigo: req.session.code,
      datos_modificados: { hora: new Date() },
      exito: true
    });

    delete req.session.code_verified;
    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}
