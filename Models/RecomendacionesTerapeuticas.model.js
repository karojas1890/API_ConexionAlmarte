import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const RecomendacionesTerapeuticas = sequelize.define("RecomendacionesTerapeuticas", {
  idrecomendacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idcategoria: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombrerecomendacion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  urlimagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duracionminutos: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "recomendacionesterapeuticas",
  freezeTableName: true,
  timestamps: false
});
 
