const db = require('../connection')

exports.fetchArticles = () => {
    
    return db
    .query(
        `SELECT articles.article_id, articles.author, articles.title, articles.topic,  articles.created_at, articles.votes, articles.article_img_url, COUNT(comments. article_id) AS comment_count
         FROM articles 
         LEFT JOIN comments ON comments.article_id = articles.article_id
         GROUP BY articles.article_id
         ORDER BY created_at DESC;`  
    )
    .then((result)=> {
        return result.rows;
    })   
}

exports.fetchArticlesById = (article_id) => {
    return db
    .query(
        `SELECT * FROM articles
         WHERE article_id = $1`, [article_id]
    )
    .then((result) => {
        const { rows } = result
        if (rows.length === 0) {
            return Promise.reject({ 
                status: 404, message: 'article_id does not exist'
        })
        } else {
            return {article: result.rows[0]};
        }
    })   
};
