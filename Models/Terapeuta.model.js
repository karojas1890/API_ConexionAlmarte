import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Terapeuta = sequelize.define(
  "Terapeuta",
  {
    identificacion: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    apellido2: {
      type: DataTypes.STRING
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigoprofesional: {
      type: DataTypes.STRING
    },
    telefono: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: "terapeuta",
    timestamps: false
  }
);
