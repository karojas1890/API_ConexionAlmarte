//sequelize pg pg-hstore para el mapeo y 

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "conexion_almarte", 
  "almarte",          
  "rfBfAn8FgBijU1U9k6GJVzgNepBxmrUt",
  {
    host: "dpg-d3m2mt8gjchc73cr1m1g-a.oregon-postgres.render.com",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
);

export async function conectarDB() {
  try {
    await sequelize.authenticate();
   
  } catch (error) {
    console.error(error);
  }
}
