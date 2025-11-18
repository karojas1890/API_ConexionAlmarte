import db from "../Data/database.js";
import bcrypt from "bcrypt";
import emailService from "../Services/email.service.js";
import { RandomAlias, RandomPassword } from "../Utils/authHelpers.js";
import mail from "@sendgrid/mail";

export async function crearUsuarioService(data) {
    const t = await db.transaction(); // iniciar transacción
    
    try {
        const { nombre, primerApellido, correo } = data;

        if (!nombre || !primerApellido) {
            throw new Error("Nombre y apellido obligatorios");
        }

        // Genera usuario y contrasena temporal
        const username = await RandomAlias(nombre, primerApellido);
        const password = RandomPassword();
        const hashPassword = await bcrypt.hash(plainPassword, 10);
        mail=correo
        // Enviar correo
        await emailService.SendNewUser(mail, username, password);

        // Ejecuta la funcion PostgreSQL  insertUsuario devuelve idUsuario
        const result = await db.query(
            `SELECT insertUsuario(:usuario, :password, NULL, 1) AS "idUsuario"`,
            {
                replacements: { usuario: alias, password: hashPassword },
                type: db.QueryTypes.SELECT,
                transaction: t
            }
        );

        const idUsuario = result[0].idUsuario;

        // Procedimiento almacenado para consultante
        await db.query(
            `CALL insertConsultante(
                :identificacion,
                :idUsuario,
                :nombre,
                :apellido1,
                :apellido2,
                :telefono,
                :correo,
                :provincia,
                :canton,
                :distrito,
                :direccion,
                :fechaNacimiento,
                :edad,
                :ocupacion,
                :lugarTrabajo,
                :tipo,
                :urlImagen
            )`,
            {
                replacements: {
                    identificacion: data.identificacion,
                    idUsuario,
                    nombre,
                    apellido1: primerApellido,
                    apellido2: data.segundoApellido,
                    telefono: data.telefono,
                    correo,
                    provincia: data.provincia,
                    canton: data.canton,
                    distrito: data.distrito,
                    direccion: data.direccion,
                    fechaNacimiento: data.fechaNacimiento,
                    edad: data.edad,
                    ocupacion: data.ocupacion,
                    lugarTrabajo: data.lugarTrabajo,
                    tipo: 1,
                    urlImagen: null
                },
                transaction: t
            }
        );

        await t.commit();
        return { message: "Usuario creado exitosamente" };

    } catch (error) {
        await t.rollback();
        throw error;
    }
}
