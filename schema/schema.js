const graphql = require('graphql');
const axios  = require('axios');
const {
    GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
    name : 'Company',
    fields : () => ({
        id : {type : GraphQLString},
        name : {type : GraphQLString},
        description : {type : GraphQLString},
        users : {
            type : new GraphQLList(UserType),
            resolve(parentValue,args){
                return axios(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(res=>res.data);
            }
        }
    })
})




const UserType = new GraphQLObjectType({
    name : 'User',
    fields : ()=> ({
        id : {type : GraphQLString},
        firstName : {type : GraphQLString},
        age : {type : GraphQLInt},
        company : {
            type : CompanyType,
            resolve(parentValue,args){
                // parentValue contains the data about the parent or 
                // the node the query is coming from ie user
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(res=>res.data);
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name : 'RootQuery',
    fields : {
        user : {
            type : UserType,
            args : { id : {type : GraphQLString}},
            resolve(parenValue, args){
                return axios.get(`http://localhost:3000/users/${args.id}`).then(response => response.data);
            }
        },
        company : {
            type : CompanyType,
            args : {
                id : {type : GraphQLString}
            },
            resolve(parentValue,args){
                return axios.get(`http://localhost:3000/companies/${args.id}`).then(res=>res.data);
            }
        }
    }
});


const mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields : {
        addUser : {
            type : UserType,
            args : {
                firstName : {type : new GraphQLNonNull(GraphQLString)},
                age : {type : new GraphQLNonNull(GraphQLInt)},
                companyId : {type : GraphQLString}
            },
            resolve(parenValue,{firstName,age,companyId}){
                return axios.post(`http://localhost:3000/users`, {firstName,age}).then(res=>res.data);
            }
        },
        deleteUser : {
            type : UserType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,args){
                return axios.delete(`http://localhost:3000/users/${args.id}`).then(res=>res.data);
            }
        },
        editUser : {
            type : UserType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLString)},
                firstName : {type : GraphQLString},
                age : {type : GraphQLInt},
                companyId : {type : GraphQLString}
            },
            resolve(parenValue,args){
                return axios.patch(`http://localhost:3000/users/${args.id}`, args).then(res=>res.data);
            }
        }
    }
})







const mySchema = new GraphQLSchema({
    query: RootQuery,
    mutation
});
module.exports = mySchema;