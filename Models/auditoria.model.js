import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Auditoria = sequelize.define("Auditoria", {
  id_actividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  identificacion_consultante: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  tipo_actividad: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ip_origen: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  dispositivo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  datos_modificados: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  exito: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "auditoria",
  freezeTableName: true,
  timestamps: false
});
