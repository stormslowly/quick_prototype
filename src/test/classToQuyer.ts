import * as chai from 'chai'
import * as chaiProps from 'chai-properties'
import {
  registerField, allRegisteredTypes, registerQuery, parameterArrayOf, allQueriesGroupByClass,
  allRegisteredTypesName, returnTypeArrayOf
} from "../lib/types";
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
      }
    ])
  })


  it('types to graphql schema', () => {

    const allTypesNames = allRegisteredTypesName()
    const allTypes = allRegisteredTypes()

    const schema = graphqlFrom(allTypesNames.map(name => ({
      name,
      fieldsDefinition: allTypes[name]
    })))

  })

})
