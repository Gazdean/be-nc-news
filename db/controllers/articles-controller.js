const {fetchArticlesById, fetchAllArticleComments} = require('../models/articles-model')

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticlesById(article_id)
        .then(({article}) => {
        res.status(200).send({ article });
    })
    .catch(next)
};

exports.getAllArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    fetchAllArticleComments(article_id)
        .then(({ comments }) => {
        res.status(200).send({ comments });
    })
    .catch(next)
};