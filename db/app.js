const express = require('express')
const app = express()

const {getTopics, getAllEndpoints} = require('./controllers/topics-controller')
const {getArticlesById} = require('./controllers/articles-controller')

app.get('/api/topics', getTopics)
app.get('/api', getAllEndpoints)
app.get('/api/articles/:article_id', getArticlesById)
app.all('/*', (req, res) => {
        res.status(404).send({mess: 'not found'})
    })
app.use((err, req, res, next) => {
    if (err.status) {
        res
        .status([err.status])
        .send({ mess: err.mess });
    }
    next(err);
})
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({mess: 'bad request'});
    } else next(err)
  });

app.use((err, req, res, next) => {  
    if (err === 500) {
        console.log(err, ('Internal server error'))
        res.status(500).send({mess: 'Internal Server Error'})
    }
  });

  

module.exports = app