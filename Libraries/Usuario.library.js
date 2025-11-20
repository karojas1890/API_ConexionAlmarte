import {sequelize} from "../Data/database.js";
import bcrypt from "bcrypt";
import emailService from "../Services/email.service.js";
import { RandomAlias, RandomPassword } from "../Utils/authHelpers.js";

export async function crearUsuarioService(body) {
    const t = await sequelize.transaction();
    
    try {
        const { 
            identificacion,
            nombre, 
            apellido1,  // Cambié primerApellido por apellido1
            apellido2,  // Cambié segundoApellido por apellido2
            telefono,
            correo,
            provincia,
            canton,
            distrito,
            direccion,
            fechaNacimiento,
            edad,
            ocupacion,
            lugarTrabajo
        } = body;

        // Validaciones básicas
        if (!nombre || !apellido1) {  // Usando los nuevos nombres
            throw new Error("Nombre y apellido obligatorios");
        }

        if (!correo) {
            throw new Error("Correo electrónico obligatorio");
        }

        // Genera usuario y contraseña temporal
        const username = await RandomAlias(nombre, apellido1);  // Usando apellido1
        const plainPassword = RandomPassword();
        const hashPassword = await bcrypt.hash(plainPassword, 10);

        // Enviar correo
        await emailService.SendNewUser(correo, username, plainPassword);

        // Ejecuta la función PostgreSQL insertUsuario
        const [result] = await sequelize.query(
            `SELECT insertUsuario(:usuario, :password, NULL, 1) AS "idUsuario"`,
            {
                replacements: { 
                    usuario: username,
                    password: hashPassword 
                },
                transaction: t
            }
        );

        const idUsuario = result[0].idUsuario;

        // Procedimiento almacenado para consultante
        await sequelize.query(
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
                    identificacion: identificacion || null,
                    idUsuario: idUsuario,
                    nombre: nombre,
                    apellido1: apellido1,  // Usando apellido1
                    apellido2: apellido2 || null,  // Usando apellido2
                    telefono: telefono || null,
                    correo: correo,
                    provincia: provincia || null,
                    canton: canton || null,
                    distrito: distrito || null,
                    direccion: direccion || null,
                    fechaNacimiento: fechaNacimiento || null,
                    edad: edad || null,
                    ocupacion: ocupacion || null,
                    lugarTrabajo: lugarTrabajo || null,
                    tipo: 1,
                    urlImagen: null
                },
                transaction: t
            }
        );

        await t.commit();
        
        return { 
            success: true,
            message: "Usuario creado exitosamente",
            data: {
                idUsuario,
                username,
                email: correo
            }
        };

    } catch (error) {
        await t.rollback();
        console.error("Error en crearUsuarioService:", error);
        
        throw new Error(error.message || "Error al crear el usuario");
    }
}