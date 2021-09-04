const mongoose = require('mongoose')

const {ApolloServer} = require('apollo-server')
const jwt = require('jsonwebtoken')

const typeDefs = require('./gql/schema')
const resolvers = require('./gql/resolver')
require('dotenv').config({path: '.env'})

mongoose.connect(process.env.DDBB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (err, _) => {
  if(err){
    console.log("Error de conexión")
  }else{
    server()
  }
})

function server(){
  const serverApollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
      const token = req.headers.authorization

      if(token) {
        try {
          const user = jwt.verify(
            token.replace('Bearer ', ''),
            process.env.SECRET_KEY
          )

          return {
            user
          }

        } catch (e) {
          console.log("#####################ERROR##########################", e)
          throw new Error('Token invalido')
        }
      }
    }
  })

  serverApollo.listen().then(({url}) => {
    console.log("########################################")
    console.log(`Servidor listo en la url ${url}`)
    console.log("########################################")
  })
}