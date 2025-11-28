
const sequelize=require("./db");
const { DataTypes } = require("sequelize");


const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fechaSalida: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    createdAt: true,
    updatedAt: false,
  }
);

module.exports=Usuario;