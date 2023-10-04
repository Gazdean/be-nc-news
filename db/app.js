const express = require('express')
const app = express()

app.use(express.json());

const {getTopics, getAllEndpoints} = require('./controllers/topics-controller')
const {getArticlesById, postArticleComment} = require('./controllers/articles-controller')
const { internalServerError, psqlError, customError, invalidEndpoint } = require('./controllers/error.controller')

app.get('/api/topics', getTopics)
app.get('/api', getAllEndpoints)
app.get('/api/articles/:article_id', getArticlesById)
app.post('/api/articles/:article_id/comments', postArticleComment)
app.all('/*', invalidEndpoint)
app.use(customError)
app.use(customError)
app.use(psqlError)
app.use(internalServerError);

module.exports = app