import {ApolloServer, UserInputError,gql} from 'apollo-server';
import {v1 as uuid} from 'uuid'
const persons = [
    {
        name: "Cristian",
        phone:"+543865332311",
        street:"San Luis 1216",
        city:"San Miguel de Tucuman",
        id:"1"
    },
    {
        name: "Facundo Vega",
        phone:"+543865332312",
        street:"Cerca de Enet",
        city:"Aguilares",
        id:"2"
    },
    {
        name: "Eduardo Nicolas",
        street: "Lejos de Enet",
        city:"Aguilares",
        id:"3"
    }
]

const typeDefinitions = gql`

    type Direccion {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        street: String!
        city: String!
        address: String!
        direccion: Direccion!
        check: String!
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            const {name} = args;
            return persons.find(person => person.name === name)
        }
    },
    Mutation:{
        addPerson: (root, args)=>{
            //const {name, phone, street, city} = args;
            if(persons.find(p=>p.name === args.name)){
                throw new UserInputError("nombre debe ser unico", {
                    invalidArgs: args.name
                })
                
            }
            const person = {...args, id: uuid()}
            persons.push(person) //actualizar bbdd
            return person
        }
    },
    Person: {
        /*name: (root) => root.name,
        phone: (root) => root.phone,
        street: (root) => root.street,
        city: (root) => root.city,
        id: (root) => root.id*/
        address: (root) => `${root.street}, ${root.city}`,
        check: () => "Midu",
        direccion: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
        //canDrink: (root) => parseInt(root.age) > 18
    }
}

const server = new ApolloServer({
    typeDefs:typeDefinitions,
    resolvers
})

server.listen().then(({url})=>{console.log('iniciando en puerto '+url)}).catch((err)=>console.log(err))