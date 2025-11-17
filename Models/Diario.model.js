import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Diario = sequelize.define("Diario", {
  Idregistro: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fechahoraregistro: {
    type: DataTypes.DATE, // TIMESTAMP equivalent
    allowNull: true
  },
  tiporegistro: {
    type: DataTypes.INTEGER,
    allowNull: true // 0 = Disparador, 1 = Avance
  },
  descripcionevento: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  emocion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "emociones",
      key: "identificador"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  conductaafrontamiento: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "conductasafrontamiento",
      key: "identificador"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  estrategiaaplicada: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "recomendacionpaciente",
      key: "idasignacion"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  efectividad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  tableName: "diario",
  timestamps: false
});
