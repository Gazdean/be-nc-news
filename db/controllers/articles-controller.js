const {fetchArticles, fetchArticlesById, createArticleComment} = require('../models/articles-model')

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
    .catch(next)
};

exports.postArticleComment = (req, res, next) => {
    const { username, body } = req.body
    const { article_id } = req.params
    createArticleComment(article_id, username, body)
    .then ((rows) => {
        console.log(rows)
        res.status(201).send({ comment: rows })
    })
    .catch((err) => {
        next(err)
    })
}