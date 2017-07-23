import * as chai from 'chai'
import * as chaiProps from 'chai-properties'

const {expect} = chai

chai.use(chaiProps)

import 'reflect-metadata'
import {allRegisteredTypes, registerFiled} from "../src/lib/types";

class Car {
  @registerFiled({})
  engineName: string

  @registerFiled({})
  capacity: number

  @registerFiled({arrayOf: 'String'})
  owners: string[]

  constructor() {
    this.engineName = 'testModel'
    this.capacity = 100
  }
}


describe('type can register with field', () => {
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
      @registerFiled({arrayOf: 'Number'})
      field: Array<number>
    }

    expect(allRegisteredTypes().PrimitiveArrayByGeneric).to.have.properties({
      field: {type: 'Array', arrayOf: 'Number'},
    })
  })

  it('array of primtive of withou assign arrayOf', () => {

    try {
      class Test {
        @registerFiled()
        array: number[]
      }
    } catch (e) {
      expect(e.toString()).to.eq('Error: Array Type must specify arrayOf property')
      return
    }
    chai.assert.fail()
  });


})