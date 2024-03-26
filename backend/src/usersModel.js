const { DataTypes } = require("sequelize");
const db = require("./db.js");

const vip_clientes = db.define("vip_clientes", {
  Id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  Nome: {
    type: DataTypes.STRING
  },
  Dtnasc: {
    type: DataTypes.DATEONLY
  },
  Senha: {
    type: DataTypes.STRING
  },
  Mae: {
    type: DataTypes.STRING
  },
  Foto: {
    type: DataTypes.TEXT
  },
  DiasAcesso: {
    type: DataTypes.STRING
  },
  Cpf: {
    type: DataTypes.STRING
  },
  HriniAcesso: {
    type: DataTypes.STRING
  },
  HrFimAcesso: {
    type: DataTypes.STRING
  },
  Livre_int: {
    type: DataTypes.INTEGER
  },
  Livre_text: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false 
});

module.exports = vip_clientes;
