import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Servicios = sequelize.define("Servicios", {
  idservicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreservicio: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  descripcionservicio: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  urlimagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duracionhoras: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: "servicios",
  timestamps: false
});

 
