import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const PME = sequelize.define("PME", {
    identificacion: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    tutor: {
        type: DataTypes.STRING
    },
    nombre: {
        type: DataTypes.STRING(100)
    },
    apellido1: {
        type: DataTypes.STRING(100)
    },
    apellido2: {
        type: DataTypes.STRING(100)
    },
    telefono: {
        type: DataTypes.STRING(50)
    },
    correo: {
        type: DataTypes.STRING(100)
    },
    provincia: {
        type: DataTypes.STRING(100)
    },
    canton: {
        type: DataTypes.STRING(100)
    },
    distrito: {
        type: DataTypes.STRING(100)
    },
    direccion_exacta: {
        type: DataTypes.STRING(200)
    },
    fecha_nacimiento: {
        type: DataTypes.DATE
    },
    edad: {
        type: DataTypes.INTEGER
    },
    escolaridad: {
        type: DataTypes.INTEGER
    },
    centro_educativo: {
        type: DataTypes.STRING(150)
    },
    parentezco_tutor: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: "pme",
    freezeTableName: true,
    timestamps: false
});



