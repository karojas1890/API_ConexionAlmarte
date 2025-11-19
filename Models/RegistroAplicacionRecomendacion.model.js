import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const RegistroAplicacionRecomendacion = sequelize.define("RegistroAplicacionRecomendacion", {
  idregistro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recomendacionaplicada: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  efectividad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  animoantes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  animodespues: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bienestarantes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bienestardespues: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fechahoraregistro: {
    type: DataTypes.DATE, // TIMESTAMP equivalente
    allowNull: true
  },
  comentario: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  identificacion: {
    type: DataTypes.STRING, // En Python viene de consultante.identificacion → tipo STRING
    allowNull: false,
    references: {
      model: "consultante",
      key: "identificacion"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  }
}, {
  tableName: "registroaplicacionrecomendacion",
  freezeTableName: true,
  timestamps: false
});

 
