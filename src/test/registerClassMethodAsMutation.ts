import * as chai from 'chai'
import * as chaiProps from 'chai-properties'
import {
  registerField, allRegisteredTypes, registerQuery, parameterArrayOf, allQueriesGroupByClass,
  allRegisteredTypesName, returnTypeArrayOf
} from "../lib/index";
import {graphqlFrom} from "../lib/typesToGraphqlSchema";
import {allMutationsGroupByClass, registerMutation} from "../lib/types/query";

const {expect} = chai

chai.use(chaiProps)


describe('class method definition', () => {


  before(() => {
    class TestMutation {
      @registerField({})
      id: string;

      @registerMutation('addANewNumber')
      @returnTypeArrayOf('Number')
      addNumber(n: number): number[] {
        return [n]
      }
    }
  })

  it('get methods definition', () => {
    expect((allMutationsGroupByClass()['TestMutation'])).to.have.properties([
      {
        methodName: 'addNumber',
        mutationName: 'addANewNumber',
        parameters:
          [{type: 'Number', identifier: 'n'}],
        returnType: {name: 'Array', arrayOf: 'Number'}
      }
    ])
  })
})
