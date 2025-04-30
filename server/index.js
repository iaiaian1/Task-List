const { ApolloServer } = require('apollo-server')
require('dotenv').config();

// Schema, resolvers and sequlize
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const { models } = require('./sequelize/index')

// Server
async function startServer(){
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => ({ models: models }) // Pass here the database model
    })
    
    server.listen().then(({ url }) => console.log(`Server: ${url}`));
}

startServer()