// sequelize
const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('projeto', 'root', '29112004', {
 host: 'localhost',
 dialect: 'mysql'
})

try {
 sequelize.authenticate()
 console.log('Conectado ao MySQL!')
} catch (err) {
 console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize