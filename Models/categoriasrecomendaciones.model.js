import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const CategoriasRecomendaciones = sequelize.define("CategoriasRecomendaciones", {
  intcategoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombrecategoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcioncategoria: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "categoriasrecomendaciones",
  freezeTableName: true,
  timestamps: false
});
