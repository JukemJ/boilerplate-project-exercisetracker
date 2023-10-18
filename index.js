const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Database = []

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.get('/api/users', (req, res) => {
  console.log(Database.every(x => typeof x == 'object'))
  res.json(Database)
})
app.get('/api/users/:_id/', (req, res) => { //TODO
  res.json(Database.find(x => x._id == req.params._id))
})
app.get('/api/users/:_id/logs', (req, res) => { //TODO
  const user = Database.find(x => x._id == req.params._id)
  let userlog = user.log
  const {from, to, limit} = req.query
  if(from) userlog = userlog.filter(x => new Date(x.date).getTime() >= new Date(from).getTime())
  if(to) userlog = userlog.filter(x => new Date(x.date).getTime() <= new Date(to).getTime())
  if(limit) userlog = userlog.slice(0,limit)
  res.json({username: user.username, count: user.count, _id: user._id, log: userlog})
})

app.post('/api/users', (req, res) => {       
  const obj = {username: req.body.username, _id: Database.length+1, log:[], count: 0}
  Database.push(obj)
  res.json(obj)
})

app.post('/api/users/:_id/exercises', (req, res) => {        //TODO
  const user = Database.find(x => x._id == req.params._id)
  const date = req.body.date ? new Date(req.body.date) : new Date()
  console.log(req.body.date, date)
  user.log.push({description: req.body.description, duration: +req.body.duration, date: date.toDateString()})
  user.count++
  res.json({username: user.username, description: req.body.description, duration: +req.body.duration, date: date.toDateString(), _id: user._id})
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
