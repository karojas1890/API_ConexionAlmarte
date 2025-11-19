import { DataTypes } from "sequelize";
import { sequelize } from "../Data/database.js";

export const Consultante = sequelize.define("Consultante", {
  identificacion: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  idusuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: true
  },
  canton: {
    type: DataTypes.STRING,
    allowNull: true
  },
  distrito: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccionexacta: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fechanacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ocupacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lugartrabajoestudio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo: {
    type: DataTypes.INTEGER,
    allowNull: true // default not explicit in original model
  },
  urlimagen: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "consultante",
  freezeTableName: true,
  timestamps: false
});
