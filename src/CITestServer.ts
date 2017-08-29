import * as express from 'express'
import * as graphQlHTTP from 'express-graphql'
import {GraphQLList, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat} from "graphql";
import {registerField, allRegisteredTypes, allRegisteredTypesName} from "./lib/types";
import {graphqlFrom} from "./lib/typesToGraphqlSchema";


const app = express()


class Car {
  @registerField()
  engineName: string;
  @registerField({arrayOf: 'String'})
  owners: string[];
}

class RefToCar {
  @registerField()
  car: Car
}


const plainTypes = allRegisteredTypes()

const types = graphqlFrom(
  allRegisteredTypesName().map(name => {
    console.log(`${__filename}:29 `, name);

    return {
      name, fieldsDefinition: plainTypes[name]
    }
  })
);


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
