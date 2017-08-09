import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';


const Car = new GraphQLObjectType({
  name: 'Car',
  fields: {
    engineName: {type: GraphQLString},
    owners: {type: new GraphQLList(GraphQLString)}
  }
})


const types = [
  Car
]

const schema = new GraphQLSchema({

  types,

  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: types[0],
        resolve() {
          return 'world';
        }
      }
    }
  })
});


const type = schema.getType('RootQueryType') as GraphQLObjectType

console.log(type.getFields())