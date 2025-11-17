import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const PagosCita = sequelize.define("PagosCita", {
  idpago: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idcita: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idmetodo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "metodospago",
      key: "idmetodo"
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fechapago: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "pagoscita",
  timestamps: false
});
