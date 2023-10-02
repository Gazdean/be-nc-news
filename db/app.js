const express = require('express')
const app = express()

const {getTopics} = require('../db/controllers/nc-news-controller')

app.get('/api/topics', getTopics)

app.all('/*', (req, res) => {
        res.status(404).send({mess: 'not found'})
    })
app.use((err, req, res, next) => {
    if (err === 500) {
        console.log(err, '500 >>>>>>>>>>>>>>>>>>')
        res.status(500).send({mess: 'Internal Server Error'})
    }
    next(err)
  });

  

module.exports = app