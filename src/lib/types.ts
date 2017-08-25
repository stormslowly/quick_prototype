import 'reflect-metadata'

const registeredTypes = {
    Number: {type: 'Number'},
    String: {type: 'String'},
    Boolean: {type: 'Number'},
}


interface IFiledDesc {
    name?: string;
    required?: boolean;
    type?: String
    arrayOf?: String
}


const getTypeWithName = (typeName: string) => {
    if (registeredTypes[typeName]) {
        return registeredTypes[typeName]
    }

    return registeredTypes[typeName] = {}

}

const registerToType = (typeName: string, desc: IFiledDesc) => {
    getTypeWithName(typeName)[desc.name] = desc
}


export const registerField = function (fieldDesc: IFiledDesc = {}) {

    return function (target: Object, key: string) {
        const typeName = target.constructor.name || fieldDesc.name

        const type = Reflect.getMetadata('design:type', target, key)

        if (type.name === 'Array' && !fieldDesc.arrayOf) {
            throw Error('Array Type must specify parameterArrayOf property')
        }

        registerToType(typeName, {
            ...fieldDesc,
            name: key, type: type.name
        })

    }
}

export const allRegisteredTypes = (): any => registeredTypes
