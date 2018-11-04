import {GraphQLBoolean, GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';
import {ITypeDef} from "./index";
import {allRegisteredTypes, allRegisteredTypesName} from "./types/fields";
import {allMutationsGroupByClass, allQueriesGroupByClass} from "./types/query";
import chalk from 'chalk'

const mapStringToGraphqlType = {
  Number: GraphQLFloat,
  String: GraphQLString,
  Boolean: GraphQLBoolean
};

function getGraphqlType(typeName: string) {
  if (mapStringToGraphqlType[typeName]) {
    return mapStringToGraphqlType[typeName]
  } else {
    throw Error(`unknown type ${typeName}`)
  }
}

function stringToGraphqlType(def: ITypeDef) {
  let name = def.name
  if (def.name === 'Array') {
    name = def.arrayOf
  }

  if (def.name === 'Promise') {
    name = def.promiseOf
  }

  const type = getGraphqlType(name)

  if (def.name === 'Array') {
    return new GraphQLList(type)
  } else {
    return type
  }

}

function toSchema(def: { type: string, arrayOf?: string }) {

  if (def.type === 'Array') {
    return new GraphQLList(toSchema({type: def.arrayOf}))
  }

  if (mapStringToGraphqlType[def.type]) {
    return mapStringToGraphqlType[def.type]
  } else {
    throw Error(`unknown type : ${def.type}  ${def.arrayOf}`)
  }
}

function putIntoStringToGraphqlSchema(name, newType) {
  mapStringToGraphqlType[name] = newType
}

export function graphqlFrom(typesDefinitions: { name: string, fieldsDefinition: any }[]): any {
  return typesDefinitions.map(td => {
    const name = td.name
    const fields = {}
    const definitionFields = td.fieldsDefinition

    const newType = new GraphQLObjectType({
      name, fields
    })
    putIntoStringToGraphqlSchema(name, newType)

    for (let fieldName in  td.fieldsDefinition) {
      const definition = definitionFields[fieldName];
      fields[fieldName] = {
        type: toSchema(definition)
      }
    }

    return newType
  })

}

export function makeExecutableSchemaFrom(...objs: any[]) {

  const plainTypes = allRegisteredTypes()
  const types = graphqlFrom(
    allRegisteredTypesName().map(name => {
      return {
        name, fieldsDefinition: plainTypes[name]
      }
    })
  );

  let getFieldsDefs = function (allQueriesDefinitionGroupByClass, category: 'Query' | 'Mutation' = "Query") {
    const fields = []
    for (let obj of objs) {
      const queryDefinitions = allQueriesDefinitionGroupByClass[obj.constructor.name]

      if (queryDefinitions) {
        const resolvers = queryDefinitions.map(qd => {
          const targetMethod = obj[qd.methodName]
          const args = qd.parameters.map(param => {
            return {
              [param.identifier]: {
                type: stringToGraphqlType({...param, name: param.type})
              }
            }
          }).reduce((a, arg) => {
            Object.assign(a, arg)
            return a
          }, {})

          return {
            [qd.queryName || qd.mutationName]: {
              type: stringToGraphqlType(qd.returnType),
              args,
              resolve(parent, param) {
                const callArgs = qd.parameters.map(({identifier}) => param[identifier])
                return targetMethod.apply(obj, callArgs)
              }
            }
          }
        })

        fields.push(...resolvers)

      } else {
        console.error(chalk.gray(`No Registered ${category} Method of class ${obj.constructor.name}`))
        // throw Error(`No Registered ${category} Method of class ${obj.constructor.name}`)
      }
    }
    return fields.reduce((map, field) => {
      Object.assign(map, field)
      return map
    }, {})
  };
  const queryFields = getFieldsDefs(allQueriesGroupByClass(), "Query");

  const mutationFields = getFieldsDefs(allMutationsGroupByClass(), "Mutation");

  return new GraphQLSchema({
    types,
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: queryFields
    }),
    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: mutationFields
    })
  })
}
