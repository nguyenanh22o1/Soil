const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { sequelize } = require('./datbase');
const schema = require('./schema/schema');
const resolvers = require('./reslovers');
const db = require('./datbase')


const app = express();
db.sync()
// Creating an asynchronous function to start and apply middleware to the server
async function startServer() {
    const server = new ApolloServer({
        typeDefs: schema,
        resolvers,
        context: ({ req }) => ({
          db,
            // Add any necessary context here
        }),
    });

    await server.start();
    server.applyMiddleware({ app });

    const port = process.env.PORT || 4000;

    await sequelize.sync();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();