// Get express object
var express = require('express');

// Get Express Graph QL 
const  express_graphql  = require('express-graphql').graphqlHTTP;

// Prepare to define the schema
var { buildSchema } = require('graphql');// GraphQL schema

// Define the schema
var schema = buildSchema(`
    type Query {
        message: String
    }
`);

// Resolver
var queryResponse = {
    message: () => 'Hello World!'
};

// Create an express server
var app = express();

// Implement the API
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: queryResponse,
    graphiql: true
}));


app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
