import * as express from 'express'
import * as graphQlHTTP from 'express-graphql'
import {GraphQLList, GraphQLObjectType, GraphQLString, GraphQLSchema} from "graphql";


const app = express()

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
          return {engineName: 'v8', owners: ['tj', 'subStack']};
        }
      },
      world: {
        type: new GraphQLList(types[0]),
        resolve(count) {
          return new Array(count).fill({engineName: 'v8', owners: ['tj', 'subStack']})
        }
      }
    }
  })
})


app.use('/graphql', graphQlHTTP({
  schema,
  graphiql: true,
}))


app.listen(9002)