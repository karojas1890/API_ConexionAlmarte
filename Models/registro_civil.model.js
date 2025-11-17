import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const RegistroCivil = sequelize.define("RegistroCivil", {
  cedula: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido1: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido2: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  lugar_nacimiento: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  sexo: {
    type: DataTypes.ENUM("Masculino", "Femenino", "Otro"),
    allowNull: true
  },
  estado_civil: {
    type: DataTypes.ENUM("Soltero", "Casado", "Divorciado", "Viudo", "Unión libre"),
    allowNull: true
  },
  nacionalidad: {
    type: DataTypes.STRING(50),
    defaultValue: "Costarricense"
  },
  provincia: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  canton: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  distrito: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  direccion_exacta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nombre_padre: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  nombre_madre: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  fecha_defuncion: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "registro_civil", 
  timestamps: false             
});
