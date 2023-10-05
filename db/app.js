const express = require('express')
const app = express()
app.use(express.json());
const {getTopics, getAllEndpoints} = require('./controllers/topics-controller')
const {getArticles, getArticlesById, getAllArticleComments, postArticleComment, patchArticleById, deleteCommentById} = require('./controllers/articles-controller')
const {internalServerError, psqlError, customError, invalidEndpoint} = require('./controllers/error.controller')
//Endpoints
app.get('/api', getAllEndpoints)
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles/:article_id/comments', getAllArticleComments)
app.post('/api/articles/:article_id/comments', postArticleComment)
app.patch('/api/articles/:article_id', patchArticleById)
app.delete('/api/comments/:comment_id', deleteCommentById)
//Error handling
app.all('/*', invalidEndpoint)
app.use(customError)
app.use(customError)
app.use(psqlError)
app.use(internalServerError);
module.exports = app