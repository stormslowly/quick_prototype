import * as chai from 'chai'
import * as chaiProps from 'chai-properties'
import {graphql, printSchema} from 'graphql';

import {registerField} from "../lib/types/fields";
import {registerMutation, registerQuery} from "../lib/types/query";
import {returnTypeArrayOf} from "../lib/types/returnType";
import {makeExecutableSchemaFrom} from "../lib/typesToGraphqlSchema";

const {expect} = chai
chai.use(chaiProps)

describe('graphql query', () => {
  class ToDo {
    @registerField()
    title: string

    @registerField()
    done: boolean
  }

  class Project {
    todos: ToDo[]

    constructor(nTodo: number) {
      this.todos = Array.from({length: nTodo}, (_, index) => ({
        title: `Task #${index + 1}`, done: false
      }))
    }

    @registerQuery()
    getNthTodo(index: number): ToDo {
      return this.todos[index]
    }

    @registerQuery()
    @returnTypeArrayOf('ToDo')
    getAllTodos(): ToDo[] {
      return this.todos
    }

    @registerMutation()
    createNewTask(title: string): boolean {
      this.todos.push({title, done: false})
      return true
    }
  }

  let schema
  before(() => {
    schema = makeExecutableSchemaFrom(new Project(2))
  })

  context('Query', () => {
    it('query getNthTodo', () => {
      return graphql(schema, `{myFirstTodo: getNthTodo(index:0){title,done}}`)
        .then(data => {
          expect(data).to.have.properties({
            data: {myFirstTodo: {title: `Task #1`}}
          })
        })
    })

    it('query arrays', () => {
      return graphql(schema, `{allTodos: getAllTodos{title}}`)
        .then(({data}: { data: any }) => {
          expect(data['allTodos']).to.have.length(2)
        })
    })
  })

  context('Mutation', () => {
    it('mutation', () => {
      return graphql(schema, `mutation{ createNewTask(title:"test") }`)
        .then(({data}) => {
          expect(data).to.have.properties({createNewTask: true})
        })
    })
  })
})


describe('bug', () => {


  context('class only with query', () => {

    class OnlyQuery {

      @registerField()
      name: string


      @registerQuery()
      getName(): string {
        return "name"
      }
    }

    class OnlyMutation {

      @registerField()
      name: string

      @registerMutation()
      getName(): string {
        return "name"
      }
    }

    it('make schema from OnlyQuery', () => {
      expect(
        () => {
          makeExecutableSchemaFrom(new OnlyQuery())
        }
      ).does.not.throw()
    })

    it('make schema from OnlyMutation', () => {
      expect(
        () => {
          makeExecutableSchemaFrom(new OnlyMutation())
        }
      ).does.not.throw()
    })

  })
})
