import * as express from 'express'
import * as graphQlHTTP from 'express-graphql'
import {GraphQLList, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat} from "graphql";
import {
  registerField,
  allRegisteredTypes,
  allRegisteredTypesName,
  allQueriesGroupByClass,
  registerQuery, returnTypeArrayOf
} from "./lib/types";
import {graphqlFrom, stringToGraphqlType} from "./lib/typesToGraphqlSchema";


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


class CarStore {

  @registerQuery()
  getACar(ncards: number = 1): Car {
    return {engineName: 'v9', owners: ['pshu']}
  }

  @registerQuery()
  @returnTypeArrayOf('Car')
  getCars(nCars: number = 1): Car[] {
    return new Array(nCars).fill({engineName: 'v9', owners: ['pshu']})
  }
}


const plainTypes = allRegisteredTypes()

const types = graphqlFrom(
  allRegisteredTypesName().map(name => {
    return {
      name, fieldsDefinition: plainTypes[name]
    }
  })
);


const allQueriesDefinitionGroupByClass = allQueriesGroupByClass()

function injectResolver(...objs: any[]) {

  const fields = []

  for (let obj of objs) {
    console.log(`${__filename}:57 injectResolver`, obj.constructor.name);

    const queryDefinitions = allQueriesDefinitionGroupByClass[obj.constructor.name]

    if (queryDefinitions) {

      const resolvers = queryDefinitions.map(qd => {

        console.log(`${__filename}:71 `, qd.parameters);

        return {
          [qd.queryName]: {
            type: stringToGraphqlType(qd.returnType),
            args: {
              nCars: {type: GraphQLFloat}
            },
            resolve: function (parent, param) {

              console.log(`${__filename}:80 resolve`, param);
              return obj[qd.methodName](1)
            }
          }
        }
      })

      fields.push(...resolvers)

    } else {
      throw Error(`No Registered Method of class ${obj.constructor.name}`)
    }
  }

  return fields.reduce((map, field) => {
    Object.assign(map, field)
    return map
  }, {})
}


const queryFields = injectResolver(new CarStore())

console.log(`${__filename}:88 qu`, queryFields);

const schema = new GraphQLSchema({
  types,
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: queryFields
  })
})


app.use('/graphql', graphQlHTTP({
  schema,
  graphiql: true,
}))


app.listen(9002)
