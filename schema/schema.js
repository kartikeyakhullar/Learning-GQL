const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema
} = graphql;

const users = [
    {id : '23', firstName : 'Rohan', age : 17},
    {id : '17', firstName : 'Rahul', age : 23}
];


const UserType = new GraphQLObjectType({
    name : 'User',
    fields : {
        id : {type : GraphQLString},
        firstName : {type : GraphQLString},
        age : {type : GraphQLInt}
    }
});


const RootQuery = new GraphQLObjectType({
    name : 'RootQuery',
    fields : {
        user : {
            type : UserType,
            args : { id : {type : GraphQLString}},
            resolve(parenValue, args){
                return _.find(users, {id : args.id});
            }
        }
    }
});


const mySchema = new GraphQLSchema({
    query: RootQuery
});
module.exports = mySchema;