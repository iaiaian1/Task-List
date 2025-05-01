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
        context: ({ req }) => { const token = req.headers.authorization || ''; return { models, token }; } // Pass here the database model
    })
    
    server.listen(4000).then(({ url }) => console.log(`Server: ${url}`));
}

startServer()