const express = require('express')
require('express-async-errors')
require('dotenv').config()
var bodyParser = require('body-parser')
const cors = require('cors')
const log4js = require('log4js');

//Configurando Log de Usuários
log4js.configure({
  appenders: {
    multi: {
      type: "multiFile",
      base: "logs/",
      property: "categoryName",
      extension: ".log",
    },
  },
  categories: {
    default: { appenders: ["multi"], level: "debug" },
  },
});

const app = express()
app.use(cors())

app.use(express.json()) //Irá suportar JSON
app.use(
  bodyParser.urlencoded({
      // Irá suportar urlenconded
      extended: true,
  })
)

app.get('/', (req, res) => {
  res.send('Pong!')
})

// Rotas
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const daoRouter = require('./routes/dao')

app.use('/v1/user', userRouter)
app.use('/v1/post', postRouter)
app.use('/v1/dao', daoRouter)

app.use((req, res, next) => {
  res.status(404).send({ error: 'Not found', status: 404, url: req.url })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`)
})