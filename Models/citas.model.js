import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Citas = sequelize.define("Citas", {
  citaid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
   
  },
  servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "servicios",
      key: "idservicio"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  iddisponibilidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "disponibilidad",
      key: "iddisponibilidad"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  estado: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pago: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: "citas",
  freezeTableName: true,
  timestamps: false
});
