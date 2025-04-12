// sequelize
import { Sequelize } from 'sequelize'
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=priceasy

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: 'localhost',
        dialect: 'mysql'
    }
)

try {
 sequelize.authenticate()
 console.log('Conectado ao MySQL!')
} catch (err) {
 console.log(`Não foi possível conectar: ${err}`)
}

export default sequelize