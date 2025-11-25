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
    const { question1, answer1, tipouss, correo, idusuario } = req.body;

    // Validaciones de entrada
    if (!question1 || !answer1 || !tipouss || !correo || !idusuario) {
      return res
        .status(400)
        .json({ success: false, message: "Datos incompletos para validar." });
    }

    const tipoUsuario = String(tipouss);

    let data = null;

    if (["1", "3", "4"].includes(tipoUsuario)) {
      // CONSULTANTE
      data = await Consultante.findOne({ where: { correo } });
      if (!data)
        return res.json({
          success: false,
          message: "Consultante no encontrado."
        });

    } else if (tipoUsuario === "2") {
      // TERAPEUTA
      data = await Terapeuta.findOne({ where: { correo } });
      if (!data)
        return res.json({
          success: false,
          message: "Terapeuta no encontrado."
        });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Tipo de usuario inválido." });
    }

    let isValid = false;

    if (["1", "3", "4"].includes(tipoUsuario)) {
      if (question1 === "id_digits") {
        isValid = answer1 === data.identificacion.slice(-3);

      } else if (question1 === "birthdate") {
        isValid = normalizeDate(answer1) === normalizeDate(data.fechanacimiento);

      } else if (question1 === "canton") {
        isValid = normalizeText(answer1) === normalizeText(data.canton);

      } else if (question1 === "phone_digits") {
        isValid = answer1 === String(data.telefono).slice(-3);
      }

    } else if (tipoUsuario === "2") {
      // TERAPEUTA
      if (question1 === "id_digits") {
        isValid = answer1 === data.identificacion.slice(-3);

      } else if (question1 === "M_last_name") {
        isValid = normalizeText(answer1) === normalizeText(data.apellidomaterno);

      } else if (question1 === "code") {
        isValid = answer1 === String(data.codigoprofesional).slice(-3);
      }
    }

    if (!isValid) {
      return res.json({
        success: false,
        message: "Respuesta incorrecta"
      });
    }

    // Buscar el usuario
    const user = await Usuario.findByPk(idusuario);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    // Generar código de 6 dígitos
     const codigo6digitos = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Código generado:', codigo6digitos); // Debug

    // Establecer expiración (10 minutos)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    // Actualizar el usuario con el código
    await Usuario.update(
      { 
        codigo6digitos,
        codigoExpiracion: expirationTime
      },
      { where: { idusuario } }
    );

    // Obtener username - VERIFICAR QUE data EXISTA Y TENGA PROPIEDADES
    let nombre = 'Usuario'; // Valor por defecto
    
    if (data) {
      if (["1", "3", "4"].includes(tipoUsuario)) {
        nombre = data.nombre || data.correo?.split('@')[0] || 'Usuario';
      } else if (tipoUsuario === "2") {
        nombre = data.nombre || data.correo?.split('@')[0] || 'Terapeuta';
      }
    }
    
    console.log('Username determinado:', nombre); // Debug
    console.log('Correo:', correo); // Debug

    // Asegurarse de que el emailService esté inicializado
    if (!emailService.initialized) {
      emailService.init();
    }

    // VERIFICAR QUE TODOS LOS PARÁMETROS ESTÉN DEFINIDOS
    if (!correo || !nombre || !codigo6digitos) {
      console.error('Parámetros faltantes:', {
        correo,
        nombre, 
        codigo6digitos
      });
      return res.status(400).json({
        success: false,
        message: "Error: Faltan parámetros para enviar el correo"
      });
    }

    // Enviar correo con el código de verificación
     await emailService.SendVerificationCodeCredentials({ 
      mail: correo,
      username: nombre,  
      code: codigo6digitos
    });
      
    

    return res.json({
      success: true,
      message: "Validación correcta. Se ha enviado un código de verificación a su correo.",
      data: {
        idusuario,
        correo,
        tipoUsuario
      }
    });

  } catch (error) {
    console.error("Error en ValidateSecurityQuestions:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

// Valida el codigo 
export async function ValidateCode(req, res) {
  try {
    const { code,idusuario,tipo_recuperacion,correo} = req.body;
        const usuario = await Usuario.findOne({
            where: { idusuario },
            attributes: ["idusuario","usuario","codigo6digitos", "codigo_expiracion"]
        });

    if (!usuario) return res.json({ success: false, message: "Usuario no encontrado" });
  

  
    if (usuario.codigo6digitos !== code) return res.json({ success: false, message: "Código incorrecto" });

    usuario.codigo6digitos = null;
    await usuario.save();

    if (tipo_recuperacion === "1") {
      req.session.code_verified = true;
      return res.json({ success: true, typw: "1", redirect_url: "/restablecer_contra" });
    } else if (tipo_recuperacion === "2") {
      req.session.code = code;
      await emailService.SendUsernameReminder({ mail: correo, uss: usuario.usuario });
      await registrarAuditoria({
        identificacion_consultante: idusuario,
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
