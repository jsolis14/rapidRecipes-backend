import "reflect-metadata"
import express from 'express';
import config from './config';
import { createConnection } from "typeorm";
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { userAuthResolvers } from "./resolvers/userAuth";


const app = express();

const server = new ApolloServer({
    typeDefs, resolvers: [userAuthResolvers],
    context: ({ res, req }) => {
        // console.log(res)
        return { res, req }
    }
})

server.applyMiddleware({ app })
app.listen({ port: 4000 }, () => {
    createConnection(config.database).then(async () => {
        console.log(`🚀 Server ready at local host 4000`);
    })
})
