import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const MetodosPago = sequelize.define("MetodosPago", {
  idmetodo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombremetodo: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "metodospago",
  freezeTableName: true,
  timestamps: false
});
