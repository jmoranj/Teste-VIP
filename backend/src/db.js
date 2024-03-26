const Sequelize = require("sequelize")

const connection = new Sequelize("ornatustst", "ornatustst", "Orn@170621", {
    host: "186.202.152.106",
    dialect: "mysql"
})

connection.authenticate()
    .then(() => {
        console.log("conectado com sucesso");
    }).catch(() => {
        console.log(error, "erro ao acessar a database");
    })

module.exports = connection;