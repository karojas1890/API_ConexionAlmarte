import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const LocalidadBarrio = sequelize.define("LocalidadBarrio", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ciudad_municipio_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  codigo_postal: {
    type: DataTypes.STRING(20),
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
  tableName: "localidad_barrio",
  freezeTableName: true,
  timestamps: false
});
