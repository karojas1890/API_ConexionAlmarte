import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Emociones = sequelize.define("Emociones", {
  identificador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "emociones",
  timestamps: false
});
