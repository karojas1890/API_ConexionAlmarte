import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Usuario = sequelize.define(
  "Usuario",
  {
    idusuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigo6digitos: {
      type: DataTypes.STRING
    },
    estado: {
      type: DataTypes.INTEGER,
      defaultValue: 1 // 1 activo, 0 inactivo
    },
    tipo: {
      type: DataTypes.INTEGER // 1=Consultante, 2=Terapeuta
    },
    intentos: {
      type: DataTypes.INTEGER
    }
  },
  {
    tableName: "usuario",
    timestamps: false
  }
);
