import {sequelize} from "../Data/database.js";
import bcrypt from "bcrypt";
import emailService from "../Services/email.service.js";
import { RandomAlias, RandomPassword } from "../Utils/authHelpers.js";

export async function crearUsuarioService(req, res) {
    const t = await sequelize.transaction();
    
    try {
        // ✅ CORRECCIÓN: Obtener body de req.body
        const body = req.body;
        
        console.log("Body completo recibido:", JSON.stringify(body, null, 2)); // ✅ Debug completo
        const nombre = body.nombre;
        const apellido1 = body.apellido1 || body.primerApellido; // ✅ Acepta ambos
        const apellido2 = body.apellido2 || body.segundoApellido;
        const { 
            identificacion,
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
        } = body; // ✅ Ahora body está definido

        // ✅ Debug de campos específicos
        console.log("Nombre recibido:", nombre);
        console.log("Apellido1 recibido:", apellido1);
        console.log("Apellido2 recibido:", apellido2);
        console.log("Correo recibido:", correo);

        // Validaciones básicas
        if (!nombre || !apellido1) {
            console.log("❌ ERROR: Nombre o apellido1 están vacíos");
            console.log("Nombre:", nombre);
            console.log("Apellido1:", apellido1);
            throw new Error("Nombre y apellido obligatorios");
        }

        if (!correo) {
            console.log("❌ ERROR: Correo está vacío");
            throw new Error("Correo electrónico obligatorio");
        }

        // Genera usuario y contraseña temporal
        const username = await RandomAlias(nombre, apellido1);
        const plainPassword = RandomPassword();
        const hashPassword = await bcrypt.hash(plainPassword, 10);

        console.log("Usuario generado:", username);
        console.log("Contraseña generada:", plainPassword);

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
        console.log("ID Usuario creado:", idUsuario);

        // Procedimiento almacenado para consultante
        await sequelize.query(
            `CALL insertConsultante(
                :identificacion,
                :idusuario,
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
                    apellido1: apellido1,
                    apellido2: apellido2 || null,
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
        
        console.log("Usuario creado exitosamente");
        
        return res.status(201).json({ 
            success: true,
            message: "Usuario creado exitosamente",
            data: {
                idUsuario,
                username,
                email: correo
            }
        });

    } catch (error) {
        await t.rollback();
        console.error("Error en crearUsuarioService:", error);
        
        return res.status(500).json({
            success: false,
            message: error.message || "Error al crear el usuario"
        });
    }
}