# Task Management App

This is a simple full-stack task management application built using:

- **GraphQL** with Apollo Server
- **Sequelize** for interacting with a SQLite database
- **React.js** for the frontend interface
- **Bootstrap** for responsive styling

## Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Getting Started
Install the dependencies for the server and client
**For the server:**
```sh
cd server
npm i
```
I also included the database.sqlite file so you can test right away but you can also run this comamnd to populate. Feel free to add more data inside bulkCreate()
```sh
node ./sequelize/populate.js
```
Finally, run the server.
```sh
node ./index.js
```

**For the client:**
Open a new terminal/bash
```sh
cd client
npm i
```
Finally, run the client.
```sh
npm run start
```
## Access Points

- **GraphQL Server**: `http://localhost:4000`
- **React App**: `http://localhost:3000`

## Notes

- Ensure `.env` variables like `JWT_SECRET` are configured, I also included it in the repository since this is just a demo.
- The app uses JWT for authentication.