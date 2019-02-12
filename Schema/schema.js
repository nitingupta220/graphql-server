// In this file we will describe our Schema that our GraphQL will contain

// importing the GraphQL
const graphql = require('graphql');
// importing the axios for fetching the data
const axios = require('axios');

// importing the required components from graphql
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = graphql;

// defining a query type in which we can query our data
// Here we are making a query for which we can fetch a User details
const UserType = new GraphQLObjectType({
	// name of the query
	name: 'user',
	// fields or we can say functionalities or methods of that query
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			// it will check where to pass the query, then it passes the query to the relevant field and the field gets executed
			// using argument `parentValue` to get the data based on the parent query.
			// In this case we are fetching the company of the user in which he worked
			resolve (parentValue, args) {
				// using axios to fetch the data
				return axios
					.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then((response) => response.data);
			}
		}
	})
});

// here we are making  a query through which we can fetch company details
const CompanyType = new GraphQLObjectType({
	name: 'Company',
	// fields or we can say functionalities or methods of that query
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			// it will check where to pass the query, then it passes the query to the relevant field and the field gets executed
			// using argument `parentValue` to get the data based on the parent query.
			// In this case we are fetching the user who are working in the company
			type: new GraphQLList(UserType),
			resolve (parentValue, args) {
				// using axios to fetch the data
				return axios
					.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then((response) => response.data);
			}
		}
	})
});

// defininf a RootQuery
// This is where our query will be executed first and then the RootQuery will decide where to pass the query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve (root, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`).then((response) => response.data);
			}
		},
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve (parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`).then((response) => response.data);
			}
		}
	}
});

// adding mutation methods to our queries
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
        // there are f3 kinds of mutations which we have normally in any CRUD app add, edit, remove
        
        // here we are defining a mutation to add a new user
		addUser: {
            // defining what type of query it will be
            // These mutations are mainly using over User Query
            // So we are specifying the type to UserType
            type: UserType,
            // specifying the arguments to be added to the new user
            // These will be the same as we describe above in our UserType query
			args: {
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
            },
            // resolver function to get the new data
			resolve (parentValue, { firstName, age, companyId }) {
				return axios
					.post(`http://localhost:3000/users`, { firstName, age, companyId })
					.then((response) => response.data);
			}
        },
        // defining a mutation to delete a user
        // We mainly deletes a user based on his ID
		deleteUser: {
            type: UserType,
            // using only id in the args because we want to delete a user based on his id
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve (parentValue, { id }) {
				return axios.delete(`http://localhost:3000/users/${id}`).then((res) => res.data);
			}
        },
        // if we want to edit a existing user
		editUser: {
            type: UserType,
            // it is upto us if we want to edit all the properties of the user or just one or two here we are specifying all the properties
			args: {
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt }
			},
			resolve (parentValue, args) {
				return axios.patch(`http://localhost:3000/users/${args.id}`, args).then((res) => res.data);
			}
		}
	}
});


// exporting our RootQuery and mutations to be used in the main app
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: mutation
});
