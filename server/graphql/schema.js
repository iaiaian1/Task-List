/*
    Define schemas, query, mutation and inputs here
*/
module.exports = `#graphql
    # Define schemas
    type User {
        id: ID!,
        name: String!
        email: String!
        password: String!
    }

    type Task {
        id: ID!,
        name: String!
        owner: ID!
        details: String!
    }

    type AuthPayload {
        token: String
    }

    type ReturnMessage{
        status: Boolean
        message: String
    }

    # Read
    type Query {
        users(id: ID): [User]
        user(token: String): Boolean

        tasks(token: String): [Task]
        task(owner: ID!): Task
    }

    # Create, Update, Delete
    type Mutation {
        # Login/logout
        login(user: LoginInput!): AuthPayload

        # User
        createUser(user: CreateUserInput!): ReturnMessage
        deleteUser(user: DeleteUserInput!): Boolean
        
        # Task
        createTask(task: CreateTaskInput!): Boolean
        updateTask(task: UpdateTaskInput!): Boolean
        deleteTask(task: DeleteTaskInput!): Boolean
    }

    input LoginInput {
        email: String!
        password: String!
    }
    
    input CreateUserInput {
        name: String!
        email: String!
        password: String!
    }

    input DeleteUserInput {
        email: String!
        password: String!
    }

    input CreateTaskInput{
        name: String!
        owner: ID!
        details: String!
    }

    input UpdateTaskInput{
        id: ID!
        name: String
        details: String
    }

    input DeleteTaskInput{
        id: ID!
    }

`