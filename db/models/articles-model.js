const db = require('../connection')

exports.fetchArticlesById = (article_id) => {
    return db
    .query(
        `SELECT * FROM articles
         WHERE article_id = $1`, [article_id])
    .then((result)=> {
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
