import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Disponibilidad = sequelize.define("Disponibilidad", {
  iddisponibilidad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horainicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  horafin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1 
  },
  idterapeuta: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: "terapeuta",
      key: "identificacion"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }
}, {
  tableName: "disponibilidad",
  freezeTableName: true,
  timestamps: false
});
