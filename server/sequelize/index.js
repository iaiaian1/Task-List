const { Sequelize, DataTypes } = require('sequelize')

/*
    DB - SQLite for simplicity.
    Define models here, this will be pushed to the actual database
    Should not be needed when using other DB providers but instead, can be used as the setup for ENVs and auths.
*/
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sequelize/database.sqlite',
})

// Models
const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: DataTypes.STRING(60),
})

const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    owner: DataTypes.STRING,
    details: DataTypes.STRING(60),
})

// Export sequelize object and models to be used in populate and server/index.js
module.exports = { sequelize, models: {User, Task} }