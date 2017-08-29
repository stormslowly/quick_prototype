import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat
} from 'graphql';


const Car = new GraphQLObjectType({
  name: 'Car',
  fields: {
    engineName: {type: GraphQLString},
    owners: {type: new GraphQLList(GraphQLString)}
  }
})


const types = [
  Car
]

const schema = new GraphQLSchema({

  types,

  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: types[0],
        resolve() {
          return 'world';
        }
      }
    }
  })
});


const type = schema.getType('RootQueryType') as GraphQLObjectType

console.log(type.getFields())


const stringToGraphqlSchema = {
  Number: GraphQLFloat,
  String: GraphQLString,
}

function toSchema(def: { type: string, arrayOf?: string }) {

  if (def.type === 'Array') {
    return new GraphQLList(toSchema({type: def.arrayOf}))
  }

  if (stringToGraphqlSchema[def.type]) {
    return stringToGraphqlSchema[def.type]
  } else {
    throw Error(`unknown type : ${def.type}  ${def.arrayOf}`)
  }
}

function putIntoStringToGraphqlSchema(name, newType) {
  stringToGraphqlSchema[name] = newType
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
