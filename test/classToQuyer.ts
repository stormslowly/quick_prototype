import * as chai from 'chai'
import * as chaiProps from 'chai-properties'
import {
  registerField, allRegisteredTypes, registerQuery, parameterArrayOf, allQueries,
  allRegisteredTypesName
} from "../src/lib/types";
import {graphqlFrom} from "../src/lib/typesToGraphqlSchema";

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
    }
  })

  it('get method definition', () => {
    expect((allQueries()['TestCarQuery'])).to.have.properties({
      methodName: 'getCar',
      queryName: 'myGetCarQuery',
      parameters:
        [{type: 'String', arrayOf: undefined},
          {type: 'TestCarQuery', arrayOf: undefined},
          {type: 'Array', arrayOf: 'Number'}],
      returnType: {name: 'TestCarQuery'}
    })
  })


  it('types to graphql schema', () => {

    const allTypesNames = allRegisteredTypesName()
    const allTypes = allRegisteredTypes()


    const schema = graphqlFrom(allTypesNames.map(name => ({
      name,
      fieldsDefinition: allTypes[name]
    })))

    console.log(`${__filename}:54 `, schema);

  })

})
