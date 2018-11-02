import * as chai from 'chai'
import * as chaiProps from 'chai-properties'
import {allRegisteredTypes, registerField} from "../lib/index";



const {expect} = chai

chai.use(chaiProps)

describe('type can register with field', () => {

  before(() => {
    class Car {
      @registerField({})
      engineName: string

      @registerField({})
      capacity: number

      @registerField({arrayOf: 'String'})
      owners: string[]

      constructor() {
        this.engineName = 'testModel'
        this.capacity = 100
      }
    }
  })

  it('simple field', () => {
    expect(allRegisteredTypes().Car).to.have.properties({
      engineName: {type: 'String'},
      capacity: {type: 'Number'}
    })
  })

  it('array of primitive', () => {
    expect(allRegisteredTypes().Car).to.have.properties({
      owners: {type: 'Array', arrayOf: 'String'},
    })
  })


  it('array of primitive by generic', () => {

    class PrimitiveArrayByGeneric {
      @registerField({arrayOf: 'Number'})
      field: number[]
    }

    expect(allRegisteredTypes().PrimitiveArrayByGeneric).to.have.properties({
      field: {type: 'Array', arrayOf: 'Number'},
    })
  })

  it('array of primtive of withou assign parameterArrayOf', () => {

    try {
      class Test {
        @registerField()
        array: number[]
      }
    } catch (e) {
      expect(e.toString()).to.eq('Error: Array Type must specify parameterArrayOf property')
      return
    }
    chai.assert.fail()
  });


})
