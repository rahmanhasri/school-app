const express = require('express')
const app = express()
let port = 3000
const teachers = require('./routes/teachers')
const subjects = require('./routes/subjects')
const students = require('./routes/students')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended : false }))

app.get('/', function(req, res) {
  res.redirect('/teachers')
})

app.use('/teachers', teachers)
app.use('/subjects', subjects)
app.use('/students', students)

app.listen(port, function() {
  console.log(`listening on port:`, port)
})