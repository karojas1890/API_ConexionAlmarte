import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const CiudadMunicipio = sequelize.define("CiudadMunicipio", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  estado_provincia_id: {
    type: DataTypes.INTEGER,
    allowNull: false
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
  tableName: "ciudad_municipio",
  freezeTableName: true,
  timestamps: false 
});
