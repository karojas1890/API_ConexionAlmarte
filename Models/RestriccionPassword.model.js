import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";


export const RestriccionPassword = sequelize.define("RestriccionPassword", {
    idregistro: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idusuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "restriccion_password",
    timestamps: false 
});




