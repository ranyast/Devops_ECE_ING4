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

// --- DEBUT CONFIG SWAGGER ---
const expressSwagger = require('express-swagger-generator')(app);

let options = {
  swaggerDefinition: {
    info: {
      description: 'This is a User REST API',
      title: 'User API',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    basePath: '/',
    produces: [
      "application/json"
    ],
    schemes: ['http', 'https']
  },
  basedir: __dirname, // Chemin absolu du dossier src
  files: ['./routes/**/*.js'] // Cherche les annotations dans le dossier routes
};
expressSwagger(options);
// --- FIN CONFIG SWAGGER ---

app.get('/', (req, res) => res.send('TP DevOps terminé avec succès par Ranya & Antoine'))
app.use('/user', userRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})

module.exports = server