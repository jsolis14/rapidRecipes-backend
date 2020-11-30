import "reflect-metadata"
import express from 'express';
import config from './config';
import { createConnection, Connection } from "typeorm";
import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from './resolvers'
// const app = express()

// app.listen(config.port, async () => {
//     console.log(`server is listening on port ${config.port}`)
//     const connection = await createConnection(config.database);




//     // const user = new User();
//     // user.firstName = 'Jesse'
//     // user.lastName = 'Solis'
//     // user.age = 23
//     // user.email = 'email@email.com'
//     // user.password = 'sadsade213123fsdfwe3'
//     // await connection.manager.save(user);
//     // console.log(`saved a new user with id: ${user.id}`)

// })

const server = new GraphQLServer({ typeDefs: './src/schema.graphql', resolvers })
createConnection(config.database).then(()=>{
    server.start(()=> console.log("server is running on port 4000"))
})
