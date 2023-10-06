const {fetchArticles, fetchArticlesById, fetchAllArticleComments, createArticleComment, updateArticleById} = require('../models/articles-model')
exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
        res.status(200).send({ articles });
      });
}
exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticlesById(article_id)
        .then(({article}) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err)
    })
};
exports.getAllArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const allPromises = Promise.all([ fetchArticlesById(article_id), fetchAllArticleComments(article_id)])
    allPromises.then((result) => {  
        const {comments} = result[1]       
        res.status(200).send({ comments });
    })
    .catch((err) => {
        next(err)
    })
};
exports.postArticleComment = (req, res, next) => {
    const { username, body } = req.body
    const { article_id } = req.params
    createArticleComment(article_id, username, body)
    .then ((rows) => {
        res.status(201).send({ comment: rows })
    })
    .catch((err) => {
        next(err)
    })
}
exports.patchArticleById = (req, res, next) => {
    const { inc_votes } = req.body
    const { article_id } = req.params;   
    const allPromises = Promise.all([ fetchArticlesById(article_id), updateArticleById(inc_votes, article_id)])
    allPromises.then((result) => {       
        const article = result[1]       
        res.status(201).send({ article });       
    })
    .catch((err) => {
        next(err)
    })
}