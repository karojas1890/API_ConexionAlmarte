import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const RecomendacionPaciente = sequelize.define("RecomendacionPaciente", {
  idasignacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idrecomendacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  duraciondias: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  momento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  consultante: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "consultante",
      key: "identificacion"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }
}, {
  tableName: "recomendacionpaciente",
  freezeTableName: true,
  timestamps: false
});


