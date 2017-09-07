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
import {graphqlFrom, injectResolver, stringToGraphqlType} from "./lib/typesToGraphqlSchema";
import {registerMutation} from "./lib/types/query";


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
  getACar(): Car {
    return {engineName: 'v9', owners: ['pshu']}
  }

  @registerQuery()
  @returnTypeArrayOf('Car')
  getCars(nCars: number = 1): Car[] {
    return new Array(nCars).fill({engineName: `v9-${nCars}`, owners: ['pshu']})
  }

  @registerMutation()
  createCar(name: string): Car {
    return {engineName: name, owners: []}
  }
}

const schema = injectResolver(new CarStore())

app.use('/graphql', graphQlHTTP({
  schema,
  graphiql: true,
}))


app.listen(9002, () => {
  console.log('working on ', 9002)
})
