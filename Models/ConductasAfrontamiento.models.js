import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const ConductasAfrontamiento = sequelize.define("ConductasAfrontamiento", {
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
  tableName: "conductasafrontamiento",
  freezeTableName: true,
  timestamps: false
});
