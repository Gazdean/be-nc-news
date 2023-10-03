const express = require('express')
const app = express()

const {getTopics, getAllEndpoints} = require('../db/controllers/nc-news-controller')

app.get('/api/topics', getTopics)
app.get('/api', getAllEndpoints)

app.all('/*', (req, res) => {
        res.status(404).send({mess: 'not found'})
    })
app.use((err, req, res, next) => {
    if (err === 500) {
        console.log(err, ('Internal server error'))
        res.status(500).send({mess: 'Internal Server Error'})
    }
  });

  

module.exports = app