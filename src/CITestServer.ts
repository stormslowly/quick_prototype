import * as express from 'express'
import * as graphQlHTTP from 'express-graphql'
import {GraphQLList, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat} from "graphql";
import {registerField, allRegisteredTypes, allRegisteredTypesName} from "./lib/types";


const app = express()

const carType = new GraphQLObjectType({
  name: 'Car',
  fields: {
    engineName: {type: GraphQLString},
    owners: {type: new GraphQLList(GraphQLString)}
  }
})


class Car {
  @registerField()
  engineName: string;
  @registerField({arrayOf: 'String'})
  owners: string[];
}


const plainTypes = allRegisteredTypes()


const stringToGraphqlSchema = {
  Number: GraphQLFloat,
  String: GraphQLString,
}

function toSchema(def) {

  if (def.type === 'Array') {
    return new GraphQLList(toSchema({type: def.arrayOf}))
  }

  if (stringToGraphqlSchema[def.type]) {
    return stringToGraphqlSchema[def.type]
  } else {
    return stringToGraphqlSchema[def.type] = new GraphQLObjectType({
      name: def.type, fields: toSchema(def.fieldsDefinition)
    })
  }
}

const types = allRegisteredTypesName().map(name => {
  const definitionFields = plainTypes[name]

  console.log(`${__filename}:52 de`, definitionFields);

  const fields = {}
  for (let fieldName in  definitionFields) {
    const definition = definitionFields[fieldName];

    console.log(`${__filename}:58 `, definition);
    fields[fieldName] = {
      type: toSchema(definition)
    }
  }


  return new GraphQLObjectType({
    name, fields
  })
});


// const types = [carType]

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
