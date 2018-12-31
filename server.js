'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');

const user = {
  name: 'foo',
  id: 1
};

const typeDefs = `
  type User {
    name: String!,
    id: Int!
  }

  type Query {
    user: User
  }
`;

const resolvers = {
  Query: {
    user: () => user
  }
};

const app = express();

app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);