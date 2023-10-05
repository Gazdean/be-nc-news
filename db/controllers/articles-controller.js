const {fetchArticles, fetchArticlesById, fetchAllArticleComments} = require('../models/articles-model')

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

exports.getAllArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    const allPromises = Promise.all([ fetchArticlesById(article_id), fetchAllArticleComments(article_id)])
        allPromises.then((result) => {  
        const {comments} = result[1]    
        console.log(comments, 'controller')    
        res.status(200).send({ comments });
    })
    .catch(next)
};