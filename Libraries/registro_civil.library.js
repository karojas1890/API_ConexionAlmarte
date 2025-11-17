import { RegistroCivil } from "../Models/registro_civil.model.js";


export async function obtenerPersonaPorCedula(cedula) {
  const persona = await RegistroCivil.findByPk(cedula);
  return persona ? persona.toJSON() : null;
}


export async function buscarPorNombre(nombre) {
  const personas = await RegistroCivil.findAll({
    where: { nombre }
  });
  return personas.map(p => p.toJSON());
}
