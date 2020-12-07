import { ApolloServer, gql } from 'apollo-server';

export const typeDefs = gql(`
type Query {
  hello(name: String): String!
  testAccess(name: String): String
}

type Error {
  path: String!
  message: String!
}

type User{
  id: String
  firstName: String
  lastName: String
  email: String
  password: String
}

type registerResponse{
  user: User
  error: [Error]
}

type LoginResponse{
  error: [Error]
  user: User
  acessToken: String
}

type Mutation {
  register(
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  ): registerResponse
  login(email: String!, password: String!): LoginResponse

}
`)
