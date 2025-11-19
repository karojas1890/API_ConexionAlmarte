import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js"; 


export const Tarjeta = sequelize.define(
  "Tarjeta",
  {
    id_tarjeta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_titular: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    numero_tarjeta: {
      type: DataTypes.STRING(19),
      allowNull: false,
    },
    ultimo4: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    fecha_expiracion: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(10),
      defaultValue: "ACTIVO",
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tarjetas",
    freezeTableName: true,
    timestamps: false,
  }
);

