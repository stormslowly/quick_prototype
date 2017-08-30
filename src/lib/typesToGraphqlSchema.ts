import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat
} from 'graphql';
import {ITypeDef} from "./types";

const mapStringToGraphqlType = {
  Number: GraphQLFloat,
  String: GraphQLString,

};


function getGrraphQltype(typeName: string) {
  if (mapStringToGraphqlType[typeName]) {
    return mapStringToGraphqlType[typeName]
  } else {
    throw Error(`unknown type ${typeName}`)
  }
}

export function stringToGraphqlType(def: ITypeDef) {
  let name = def.name
  if (def.name === 'Array') {
    name = def.arrayOf
  }
  const type = getGrraphQltype(name)

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
