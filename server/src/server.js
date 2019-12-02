const knex = require('knex')
const app = require('./app')
const { PORT, DB_URL, IMAGE_FOLDER_PATH } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)
app.set('imageFolderPath', IMAGE_FOLDER_PATH)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})