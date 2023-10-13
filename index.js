const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Database = []

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.get('/api/users', (req, res) => {
  res.json(Database)
})
app.get('api/users/:_id/', (req, res) => { //TODO
  res.json(Database.find(x => x._id == req.params._id))
})

app.post('/api/users', (req, res) => {       
  const obj = {username: req.body.username, _id: Database.length+1, log:[], count: 0}
  Database.push(obj)
  res.json(obj)
})

app.post('/api/users/:_id/exercises', (req, res) => {        //TODO
  const user = Database.find(x => x._id == req.params._id)
  const date = new Date(req.body.date) || new Date()
  user.log.push({description: req.body.description, duration: +req.body.duration, date: date.toDateString()})
  user.count++
  res.json({username: user.username, description: req.body.description, duration: +req.body.duration, date: date.toDateString(), _id: user._id})
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
