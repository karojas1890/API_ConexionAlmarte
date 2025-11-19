// Importa todos los modelos

import { Servicios } from "../Models/Servicios.model.js";
import { Disponibilidad } from "../Models/Disponibilidad.model.js";
import { Citas } from "../Models/citas.model.js";
import { EstadoProvincia } from "../Models/EstadoProvincia.model.js";
import { CiudadMunicipio } from "../Models/CiudadMunicipio.models.js";
import { Usuario } from "../Models/Usuario.model.js";
import { Consultante } from "../Models/Consultante.model.js";
import { Diario } from "../Models/Diario.model.js";
import { Emociones } from "../Models/Emociones.model.js";
import { ConductasAfrontamiento } from "../Models/ConductasAfrontamiento.models.js";
import { RecomendacionPaciente } from "../Models/RecomendacionPaciente.model.js";
import { Terapeuta } from "../Models/Terapeuta.model.js";
import { Pais } from "../Models/Pais.model.js";
import { LocalidadBarrio } from "../Models/LocalidadBarrio.model.js";
import { PagosCita } from "../Models/PagosCita.model.js";
import { MetodosPago } from "../Models/MetodosPago.model.js";
import { PME } from "../Models/PME.model.js"
import { RestriccionPassword } from "../Models/RestriccionPassword.model.js"
import { CategoriasRecomendaciones } from "../Models/categoriasrecomendaciones.model.js";
import { RecomendacionesTerapeuticas } from "../Models/RecomendacionesTerapeuticas.model.js";
import { RecursosApoyo } from "../Models/RecursosApoyo.model.js";
import { RegistroAplicacionRecomendacion } from "../Models/RegistroAplicacionRecomendacion.model.js";
import  { Tarjeta } from "../Models/Tarjeta.model.js"
export function applyRelations() {
// Consultante a Citas
Consultante.hasMany(Citas, { foreignKey: "usuario", as: "citas" });
Citas.belongsTo(Consultante, { foreignKey: "usuario", as: "consultante" });

// Servicios a  Citas
Servicios.hasMany(Citas, { foreignKey: "servicio", as: "citas" });
Citas.belongsTo(Servicios, { foreignKey: "servicio", as: "servicio_detalle" });

// Disponibilidad a Citas
Disponibilidad.hasMany(Citas, { foreignKey: "iddisponibilidad", as: "citas" });
Citas.belongsTo(Disponibilidad, { foreignKey: "iddisponibilidad", as: "disponibilidad" });

EstadoProvincia.hasMany(CiudadMunicipio, {foreignKey: "estado_provincia_id", as: "ciudades_municipios"});
CiudadMunicipio.belongsTo(EstadoProvincia, {foreignKey: "estado_provincia_id",as: "estado_provincia"});

Usuario.hasMany(Consultante, { foreignKey: "idusuario", as: "consultantes" });
Consultante.belongsTo(Usuario, { foreignKey: "idusuario", as: "usuario" });

// Diario a Emociones
Emociones.hasMany(Diario, { foreignKey: "emocion", as: "diarios_emocion" });
Diario.belongsTo(Emociones, { foreignKey: "emocion", as: "emocion_rel" });

// Diario a ConductasAfrontamiento
ConductasAfrontamiento.hasMany(Diario, { foreignKey: "conductaafrontamiento", as: "diarios_conducta" });
Diario.belongsTo(ConductasAfrontamiento, { foreignKey: "conductaafrontamiento", as: "conducta_rel" });

// Diario a RecomendacionPaciente
RecomendacionPaciente.hasMany(Diario, { foreignKey: "estrategiaaplicada", as: "diarios_estrategia" });
Diario.belongsTo(RecomendacionPaciente, { foreignKey: "estrategiaaplicada", as: "estrategia_rel" });

// Disponibilidad a Terapeuta  
Disponibilidad.belongsTo(Terapeuta, {foreignKey: "idterapeuta",as: "terapeuta_rel"});

// Terapeuta a Disponibilidad 
Terapeuta.hasMany(Disponibilidad, {foreignKey: "idterapeuta",as: "disponibilidades"});


EstadoProvincia.belongsTo(Pais, { foreignKey: "pais_id", as: "pais"});
Pais.hasMany(EstadoProvincia, {foreignKey: "pais_id",as: "estados_provincias"});


// LocalidadBarrio aCiudadMunicipio 
LocalidadBarrio.belongsTo(CiudadMunicipio, {foreignKey: "ciudad_municipio_id", as: "ciudad_municipio"});

// CiudadMunicipio aLocalidadBarrio
CiudadMunicipio.hasMany(LocalidadBarrio, {foreignKey: "ciudad_municipio_id",as: "localidades_barrios"});


// PagosCita a Citas
PagosCita.belongsTo(Citas, {foreignKey: "idcita",as: "cita_rel"});

// Citas a PagosCita
Citas.hasMany(PagosCita, {foreignKey: "idcita",as: "pagos_rel"});

// PagosCita aMetodosPago
PagosCita.belongsTo(MetodosPago, {foreignKey: "idmetodo",as: "metodo_rel"});

// MetodosPago a PagosCita
MetodosPago.hasMany(PagosCita, {foreignKey: "idmetodo",as: "pagos_rel"});


RestriccionPassword.belongsTo(Usuario, {foreignKey: "idusuario",as: "usuario"});

Usuario.hasMany(RestriccionPassword, {foreignKey: "idusuario",as: "historial_passwords"});

// 🔗 Relaciones
PME.belongsTo(Consultante, {foreignKey: "tutor",as: "tutor_rel"});

Consultante.hasMany(PME, {foreignKey: "tutor",as: "pmes"});


// RecomendacionesTerapeuticas a RecomendacionPaciente
RecomendacionesTerapeuticas.hasMany(RecomendacionPaciente, { foreignKey: "idrecomendacion", as: "pacientes" });
RecomendacionPaciente.belongsTo(RecomendacionesTerapeuticas, { foreignKey: "idrecomendacion", as: "recomendacion_rel" });

// Consultante a RecomendacionPaciente
Consultante.hasMany(RecomendacionPaciente, { foreignKey: "consultante", as: "recomendaciones" });
RecomendacionPaciente.belongsTo(Consultante, { foreignKey: "consultante", as: "consultante_rel" });

// Categoría a Recomendaciones terapeuticas
CategoriasRecomendaciones.hasMany(RecomendacionesTerapeuticas, {foreignKey: "idcategoria",as: "recomendaciones"});
RecomendacionesTerapeuticas.belongsTo(CategoriasRecomendaciones, {foreignKey: "idcategoria",as: "categoria"});

// Recomendación a Recursos de apoyo
RecomendacionesTerapeuticas.hasMany(RecursosApoyo, {foreignKey: "recomendacion",as: "recursos"});
RecursosApoyo.belongsTo(RecomendacionesTerapeuticas, {foreignKey: "recomendacion",as: "recomendacion_apoyo"});

// Relacion a RecomendacionPaciente
RecomendacionPaciente.hasMany(RegistroAplicacionRecomendacion, {foreignKey: "recomendacionaplicada",as: "registros_aplicacion"});
RegistroAplicacionRecomendacion.belongsTo(RecomendacionPaciente, {foreignKey: "recomendacionaplicada",as: "recomendacion_asignada"});

// Relacion con Consultante
Consultante.hasMany(RegistroAplicacionRecomendacion, {foreignKey: "identificacion",as: "registros_recomendacion"});
RegistroAplicacionRecomendacion.belongsTo(Consultante, {foreignKey: "identificacion",as: "consultante_registro"});


Tarjeta.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Tarjeta, { foreignKey: "id_usuario", as: "tarjetas" });


Terapeuta.belongsTo(Usuario, { foreignKey: "idusuario", as: "usuario" });
Usuario.hasOne(Terapeuta, { foreignKey: "idusuario", as: "terapeuta" });
}