const express = require('express')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

const db = require('./dbClient')
db.on("error", (err) => {
  console.error(err)
})

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/user', userRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})

const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
    info: {
      description: 'User API documentation',
      title: 'User API',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      "application/json"
    ],
    schemes: ['http'],
  },
  basedir: __dirname, // Dossier de base
  files: ['./routes/**/*.js'] // Chemin vers tes fichiers de routes pour extraire la doc
};
expressSwagger(options);


module.exports = server
