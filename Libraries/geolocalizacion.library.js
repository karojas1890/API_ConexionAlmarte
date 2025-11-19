import { sequelize } from "../Data/database.js";
import {Pais} from "../Models/Pais.model.js"
import { EstadoProvincia } from "../Models/EstadoProvincia.model.js";
import { CiudadMunicipio } from "../Models/CiudadMunicipio.models.js";
import { LocalidadBarrio } from "../Models/LocalidadBarrio.model.js";

// Obtener Paises

export async function GetPais(req, res) {
  try {
    const paises = await Pais.findAll({
      where: { activo: true }
    });

    const data = paises.map(p => ({
      id: p.id,
      nombre: p.nombre,
      codigo_iso: p.codigo_iso,
      fecha_creacion: p.fecha_creacion
    }));
    res.status(200).json(data);
  } catch (err) {
    console.error("[ERROR GetPais]:", err);
    res.status(500).json({ error: "No se pudieron obtener los países" });
  }
}


// Obtener Estados / Provincias

export async function GetEstado(req, res) {
  try {
    const pais_id = req.query.pais_id;

    if (!pais_id) {
      return res.status(400).json({ error: "Se requiere el parámetro 'pais_id'" });
    }

    const estados = await EstadoProvincia.findAll({
      where: {
        pais_id: pais_id,
        activo: true
      }
    });

    const data = estados.map(e => ({
      id: e.id,
      nombre: e.nombre,
      codigo: e.codigo,
      pais_id: e.pais_id,
      fecha_creacion: e.fecha_creacion
    }));

    return res.status(200).json(data);

  } catch (err) {
    console.error("[ERROR GetEstado]:", err);
    return res.status(500).json({ error: "No se pudieron obtener los estados/provincias" });
  }
}

// Obtener Ciudades

export async function GetCiudad(req, res) {
  try {
    const estado_id = req.query.estado_id;

    if (!estado_id) {
      return res.status(400).json({ error: "Se requiere el parámetro 'estado_id'" });
    }

    const ciudades = await CiudadMunicipio.findAll({
      where: {
        estado_provincia_id: estado_id,
        activo: true
      }
    });

    const data = ciudades.map(c => ({
      id: c.id,
      nombre: c.nombre,
      codigo: c.codigo,
      estado_provincia_id: c.estado_provincia_id,
      fecha_creacion: c.fecha_creacion
    }));

    return res.status(200).json(data);

  } catch (err) {
    console.error("[ERROR GetCiudad]:", err);
    return res.status(500).json({ error: "No se pudieron obtener las ciudades/municipios" });
  }
}

// Obtener Barrios

export async function GetBarrio(req, res) {
  try {
    const ciudad_id = req.query.ciudad_id;

    if (!ciudad_id) {
      return res.status(400).json({ error: "Se requiere el parámetro 'ciudad_id'" });
    }

    const barrios = await LocalidadBarrio.findAll({
      where: {
        ciudad_municipio_id: ciudad_id,
        activo: true
      }
    });

    const data = barrios.map(b => ({
      id: b.id,
      nombre: b.nombre,
      codigo_postal: b.codigo_postal,
      ciudad_municipio_id: b.ciudad_municipio_id,
      fecha_creacion: b.fecha_creacion
    }));

    return res.status(200).json(data);

  } catch (err) {
    console.error("[ERROR GetBarrio]:", err);
    return res.status(500).json({ error: "No se pudieron obtener los barrios/localidades" });
  }
}