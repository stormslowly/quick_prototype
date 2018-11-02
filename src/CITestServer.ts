import * as express from 'express'
import * as graphQlHTTP from 'express-graphql'
import {registerField, registerQuery, returnTypeArrayOf, returnTypePromiseOf} from "./lib/types";
import {registerMutation} from "./lib/types/query";
import {injectResolver} from "./lib/typesToGraphqlSchema";

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
