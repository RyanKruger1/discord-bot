const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize('news', process.env.MYSQL_USERNAME , process.env.MYSQL_PASSWORD, { 
    dialect: 'mysql', 
    host: 'localhost',
    port:'3306'
})

module.exports = sequelize