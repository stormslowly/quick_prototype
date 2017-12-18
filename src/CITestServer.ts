import * as express from 'express'
import * as graphQlHTTP from 'express-graphql'
import {GraphQLList, GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLFloat} from "graphql";
import {
  registerField,
  allRegisteredTypes,
  allRegisteredTypesName,
  allQueriesGroupByClass,
  registerQuery, returnTypeArrayOf, returnTypePromiseOf
} from "./lib/types";
import {graphqlFrom, injectResolver, stringToGraphqlType} from "./lib/typesToGraphqlSchema";
import {registerMutation} from "./lib/types/query";

const app = express()

function entity<T extends { new(...args: any[]) }>(Entity: T) {

  return class extends Entity {
    static async findById(id: string): Promise<T> {
      return {} as T
    }

    test() {
      console.log('test')
    }
  }

}

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
  @returnTypePromiseOf('Car')
  async getACarById(id: string): Promise<Car> {
    const car = new Car()
    car.engineName = 'wag1'
    car.owners = ['shelly']
    return car
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
