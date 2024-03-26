const { DataTypes } = require("sequelize");
const db = require("./db.js");

const vip_movcli = db.define("vip_movcli", {
	Idmov: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	Id_cliente: {
		type: DataTypes.INTEGER,
	},
	Local: {
		type: DataTypes.STRING
	},
	Dthrent: {
		type: DataTypes.DATE
	},
	Dthrsai: {
		type: DataTypes.DATE
	},
	Idstatus: {
		type: DataTypes.INTEGER
	},
	Motbloqueio: {
		type: DataTypes.STRING
	},
	Obsacesso: {
		type: DataTypes.STRING
	},
}, {
	tableName: "vip_movcli",
	timestamps: false
});

module.exports = vip_movcli;
