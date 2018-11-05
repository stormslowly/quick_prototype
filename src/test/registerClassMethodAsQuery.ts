import * as chai from 'chai'
import * as chaiProps from 'chai-properties'
import {printSchema} from "graphql";
import {
  registerField, allRegisteredTypes, registerQuery, parameterArrayOf, allQueriesGroupByClass,
  allRegisteredTypesName, returnTypeArrayOf, returnTypePromiseOfArray, makeExecutableSchemaFrom
} from "../lib/index";
import {graphqlFrom} from "../lib/typesToGraphqlSchema";

const {expect} = chai

chai.use(chaiProps)


describe('class method defination', () => {

  before(() => {
    class TestCarQuery {
      @registerField({})
      id: string;

      @registerQuery('myGetCarQuery')
      getCar(name: string, other: TestCarQuery, @parameterArrayOf('Number') numbers: number[]): TestCarQuery {
        this.id = name + other.id
        return this
      }

      @registerQuery()
      @returnTypeArrayOf('Number')
      getCars(): number[] {
        return [1]
      }

      @registerQuery()
      @returnTypePromiseOfArray('Number')
      async asyncGetCars(): Promise<number[]> {
        return [1]
      }
    }
  })

  it('get methods definition', () => {

    expect((allQueriesGroupByClass()['TestCarQuery'])).to.have.properties([
      {
        methodName: 'getCar',
        queryName: 'myGetCarQuery',
        parameters:
          [{type: 'String', identifier: 'name'},
            {type: 'TestCarQuery', identifier: 'other'},
            {type: 'Array', arrayOf: 'Number', identifier: 'numbers'}],
        returnType: {name: 'TestCarQuery'}
      },
      {
        methodName: 'getCars',
        queryName: 'getCars',
        parameters: [],
        returnType: {name: 'Array', arrayOf: 'Number'}
      },
      {
        methodName: 'asyncGetCars',
        queryName: 'asyncGetCars',
        parameters: [],
        returnType: {name: 'Promise', promiseArrayOf: 'Number'}
      }

    ])
  })

})
