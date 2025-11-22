import { Usuario } from "../Models/Usuario.model.js";

export function RandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function RandomAlias(nombre, apellido) {
    const inicial = nombre[0].toLowerCase();
    const primerApellido = apellido.split(" ")[0].toLowerCase();

    const baseAlias = `${inicial}${primerApellido}`;

    const ultimo = await Usuario.findOne({
        order: [["idusuario", "DESC"]],
        attributes: ["usuario"]
    });

    let numero = 1000;

    if (ultimo) {
        const match = ultimo.usuario.match(/(\d+)$/);
        numero = match ? parseInt(match[1]) + 1 : 1000;
    }

    return `${baseAlias}${numero}`;
}
