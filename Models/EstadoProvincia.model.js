import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const EstadoProvincia = sequelize.define("EstadoProvincia", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pais_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "estado_provincia",
  timestamps: false
});
