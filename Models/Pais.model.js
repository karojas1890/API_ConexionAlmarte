import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Pais = sequelize.define("Pais", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    codigo_iso: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true
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
    tableName: "pais",
    freezeTableName: true,
    timestamps: false  
});


