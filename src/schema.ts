import {ApolloServer, gql } from 'apollo-server';

export const typeDefs = gql(`
type Query {
  hello(name: String): String!
}

type Error {
  path: String!
  message: String!
}

type Mutation {
  register(
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  ): [Error!]
}
`)
