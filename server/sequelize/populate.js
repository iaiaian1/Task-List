const { sequelize, models } = require('./index')
const bcrypt = require('bcrypt');

async function populate() {
    try{
        // This kinda force deletes the content of database.
        await sequelize.sync({ force: true })

        // Users
        await models.User.bulkCreate(
            [
                {
                    name: 'Nolan',
                    email: 'viltrum@viltrum.com',
                    password: await bcrypt.hash('viltrum', 10)
                },
                {
                    name: 'Debbie',
                    email: 'just@pet.com',
                    password: await bcrypt.hash('pet', 10)
                }
            ]
        )

        // Tasks
        await models.Task.bulkCreate(
            [
                {
                    name: 'Wash Dishes',
                    owner: '1',
                    details: 'Wash the dishes'
                },
                {
                    name: 'Groceries',
                    owner: '1',
                    details: 'Buy groceries'
                },
                {
                    name: 'Hang Clothes',
                    owner: '2',
                    details: 'Dry clothes'
                },
                {
                    name: 'Carwash',
                    owner: '2',
                    details: 'Wash the car'
                }
            ]
        )
    } catch(error){
        console.log('Error populating: ', error)
    } finally {
        await sequelize.close();
    }
}
  
populate()