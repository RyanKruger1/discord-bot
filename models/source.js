const Sequelize = require('sequelize')

const sequelize = require('../utils/database.js')

const source = sequelize.define('source',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    link:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    }
})

module.exports = source