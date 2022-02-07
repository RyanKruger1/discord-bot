const Sequelize = require('sequelize')

const sequelize = require('../utils/database.js')

const article = sequelize.define('article',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title : {
        type: Sequelize.STRING(2000),
        allowNull: true
    },
    source : {
        type: Sequelize.STRING(2000),
        allowNull: false
    },
    link: {
        type: Sequelize.STRING(2000),
        allowNull: false
    },
    description : {
        type: Sequelize.STRING(6000),
        allowNull: true
    },
    publicationDate :{
        type: Sequelize.DATE,
        allowNull: true
    },
    published : {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

module.exports = article