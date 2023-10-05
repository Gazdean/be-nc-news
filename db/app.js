const express = require('express')
const app = express()

const {getTopics, getAllEndpoints} = require('./controllers/topics-controller')
const {getArticles, getArticlesById, getAllArticleComments} = require('./controllers/articles-controller')
const { internalServerError, psqlError, customError, invalidEndpoint } = require('./controllers/error.controller')

//Endpoints
app.get('/api', getAllEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles/:article_id/comments', getAllArticleComments)

//Error handling
app.all('/*', invalidEndpoint)
app.use(customError)
app.use(customError)
app.use(psqlError)
app.use(internalServerError);

module.exports = app