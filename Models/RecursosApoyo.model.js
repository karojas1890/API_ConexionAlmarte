import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const RecursosApoyo = sequelize.define("RecursosApoyo", {
  idrecurso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombrerecurso: {
    type: DataTypes.STRING,
    allowNull: false
  },
  urlrecurso: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duracionminutos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  recomendacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "recomendacionesterapeuticas",
      key: "idrecomendacion"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }
}, {
  tableName: "recursosapoyo",
  timestamps: false
});

 
