import "reflect-metadata"
import express from 'express';
import config from './config';
import { createConnection, Connection } from "typeorm";
import { resolvers } from './resolvers';
import { ApolloServer, gql } from 'apollo-server';
import { typeDefs } from './schema';


const app = express();

const server = new ApolloServer({
    typeDefs, resolvers,
    context: ({ res, req }) => {
        // console.log(res)
        return { res, req }
    }
})

server.listen().then(() => {
    createConnection(config.database).then(async () => {
        console.log(`🚀 Server ready at local host 4000`);
    })

});
