// import all the dependencies

// Using express to manage server
const express = require('express');
// using express-graphql for using GraphQl services in node
const expressGraphQL = require('express-graphql');
// importing the schema which we defined in the schema.js
const schema = require('./Schema/schema');

// making a instance of the express app and store it in the app variable
const app = express();
// specifying the port
const port = 4005;

// using app.use to acts as a middleware, whatever we pass into it, it will serve a connection of GraphQl and Express
// It takes two things first is route and second is the file which will be used inside the route
app.use(
	'/graphql',
	expressGraphQL({
        // using the above imported schema
        schema,
        // setting the graphiql to true so that we can use the GraphQl client
		graphiql: true
	})
);

// it is used to indicated on which port our app will run
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
